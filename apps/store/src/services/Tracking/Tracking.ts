import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import {
  AppTrackingContext,
  EcommerceEvent,
  pushToGTMDataLayer,
  setGtmContext,
} from '@/services/gtm'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { newSiteAbTest } from '../../newSiteAbTest'

type TrackingContext = Partial<Record<TrackingContextKey, unknown>>

export enum TrackingEvent {
  AddToCart = 'add_to_cart',
  BeginCheckout = 'begin_checkout',
  DeleteFromCart = 'delete_from_cart',
  ExperimentImpression = 'experiment_impression',
  OfferCreated = 'offer_created',
  PageView = 'virtual_page_view',
  Purchase = 'purchase',
  SignedCustomer = 'signed_customer',
  ViewCart = 'view_cart',
  ViewItem = 'view_item',
}

export enum TrackingContextKey {
  City = 'city',
  CountryCode = 'countryCode',
  Customer = 'customer',
  NumberOfPeople = 'numberOfPeople',
  ShopSessionId = 'shopSessionId',
  ZipCode = 'zipCode',
}

// Simple version with 2 destinations (GTM and Datadog) implemented inline
export class Tracking {
  static LOGGER_NAME = 'tracking'

  constructor(public context: TrackingContext = {}) {}

  private logger = datadogLogs.getLogger(Tracking.LOGGER_NAME)!

  public setContext = (key: TrackingContextKey, value: unknown) => {
    if (this.context[key] !== value) {
      console.debug(`tracking context ${key}:`, value)
    }
    if (value != null) {
      this.context[key] = value
    } else {
      delete this.context[key]
    }
  }

  public setAppContext = (context: AppTrackingContext) => {
    this.setContext(TrackingContextKey.CountryCode, context.countryCode)
    setGtmContext(context)
  }

  public setPriceIntentContext = (priceIntent: PriceIntent) => {
    const { numberCoInsured } = priceIntent.data
    this.setContext(
      TrackingContextKey.NumberOfPeople,
      numberCoInsured ? parseInt(numberCoInsured, 10) + 1 : undefined,
    )
    this.setContext(TrackingContextKey.ZipCode, priceIntent.data.zipCode)
    this.setContext(TrackingContextKey.City, priceIntent.data.city)
  }

  public reportPageView(urlPath: string) {
    const event = {
      event: TrackingEvent.PageView,
      pageData: {
        page: urlPath,
        title: document.title,
      },
    }
    console.debug(event.event, urlPath)
    pushToGTMDataLayer(event)
  }

  public reportExperimentImpression(variantId: string) {
    const event = {
      event: TrackingEvent.ExperimentImpression,
      eventData: {
        experiment_id: newSiteAbTest.optimizeExperimentId,
        variant_id: variantId,
      },
    }
    console.debug(event.event, variantId)
    pushToGTMDataLayer(event)
  }

  // Legacy event in market-web format
  public async reportOfferCreated(offer: ProductOfferFragment) {
    const event = TrackingEvent.OfferCreated
    const eventData = {
      offerData: {
        insurance_price: offer.price.amount,
        currency: offer.price.currencyCode as string,

        insurance_type: offer.variant.typeOfContract,
        flow_type: offer.variant.product.name,
        ...getLegacyEventFlags([offer.variant.typeOfContract]),
      },
      userData: await getLegacyUserData(this.context),
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  // Legacy event in market-web format
  public async reportSignedCustomer(cart: CartFragmentFragment) {
    const event = TrackingEvent.SignedCustomer
    const eventData = {
      offerData: {
        quote_cart_id: cart.id,
        transaction_id: cart.id,

        discounted_premium: cart.cost.net.amount,
        insurance_price: cart.cost.gross.amount,
        currency: cart.cost.net.currencyCode as string,

        insurance_type: cart.entries[0].variant.typeOfContract,
        flow_type: cart.entries[0].variant.product.name,
        ...getLegacyEventFlags(cart.entries.map((entry) => entry.variant.typeOfContract)),
      },
      userData: await getLegacyUserData(this.context),
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  public reportViewItem(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.ViewItem, offer))
  }

  public reportAddToCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.AddToCart, offer))
  }

  public reportDeleteFromCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.DeleteFromCart, offer))
  }

  public reportViewCart(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.ViewCart, cart))
  }

  public reportBeginCheckout(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.BeginCheckout, cart))
  }

  public reportPurchase(cart: CartFragmentFragment) {
    const event = cartToEcommerceEvent(TrackingEvent.Purchase, cart)
    event.ecommerce.transaction_id = cart.id
    this.reportEcommerceEvent(event)
    // Also report in web-onboarding format
    this.reportSignedCustomer(cart)
  }

  // Google Analytics ecommerce events
  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm
  private reportEcommerceEvent(ecommerceEvent: EcommerceEvent) {
    const { event, ...dataFields } = ecommerceEvent
    this.logger.log(event, dataFields)
    datadogRum.addAction(event, dataFields)
    pushToGTMDataLayer(ecommerceEvent)
  }
}

datadogLogs.createLogger(Tracking.LOGGER_NAME)

const offerToEcommerceEvent = (
  event: TrackingEvent,
  offer: ProductOfferFragment,
): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: offer.price.amount,
      currency: offer.price.currencyCode,
      items: [
        {
          item_id: offer.variant.typeOfContract,
          item_name: offer.variant.displayName,
          price: offer.price.amount,
        },
      ],
    },
  } as const
}

// NOTE: Intentionally not adding coupon field, there's no good mapping between our model and analytics
// Let's figure it out later when/if it becomes a priority
const cartToEcommerceEvent = (event: TrackingEvent, cart: CartFragmentFragment): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: cart.cost.net.amount,
      currency: cart.cost.net.currencyCode,
      items: cart.entries.map((entry) => ({
        item_id: entry.variant.typeOfContract,
        item_name: entry.variant.displayName,
        price: entry.price.amount,
      })),
    },
  } as const
}

// TODO: Decide what do to with
// ownership_type - maybe expose though API?
// number_of_people - get from offer, tricky for cart
const getLegacyEventFlags = (typesOfContract: Array<string>) => {
  return {
    has_home: typesOfContract.some((type) => type.includes('_APARTMENT')),
    has_house: typesOfContract.some((type) => type.includes('_HOUSE')),
    has_car: typesOfContract.some((type) => type.includes('_CAR_')),
    has_accident: typesOfContract.some((type) => type.includes('_ACCIDENT')),
    is_student: typesOfContract.some((type) => type.includes('STUDENT')),
    car_sub_type: typesOfContract.find((type) => type.includes('_CAR_')),
  } as const
}

// Retargeting info for web-onboarding compatibility
// Reference for formatting user data
// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
const getLegacyUserData = async (context: TrackingContext) => {
  const customer = context.customer as ShopSession['customer']
  if (!customer) return {}
  const firstName = await hashValue(normalizeUserValue(customer.firstName))
  const lastName = await hashValue(normalizeUserValue(customer.lastName))
  const email = await hashValue(normalizeUserValue(customer.email))
  const zipCode = await hashValue(normalizeUserValue(context.zipCode))
  const city = await hashValue(normalizeUserValue(context.city))
  const country = await hashValue(normalizeUserValue(context.countryCode))
  return {
    fn: firstName,
    ln: lastName,
    em: email,
    ad: {
      zp: zipCode,
      ct: city,
      co: country,
    },
  } as const
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
export const hashValue = async (value?: string) => {
  const msgUint8 = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const normalizeUserValue = (value: unknown) => {
  if (value && typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Unexpected type for userData normalization ${typeof value}`)
  }
  const punctuationAndWhitespaceRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g
  return (
    value?.toString().toLowerCase().trim().replace(punctuationAndWhitespaceRegex, '') ?? undefined
  )
}
