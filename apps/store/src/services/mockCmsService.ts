import {
  SWEDEN_APARTMENT_FORM,
  SWEDEN_CAR_FORM,
} from '@/components/PriceCalculator/PriceCalculator.constants'
import { PriceForm } from '@/components/PriceCalculator/PriceCalculator.types'
import { MarketLabel } from '@/lib/l10n/types'

export type CmsProduct = {
  name: string
  market: MarketLabel
  displayName: string
  slug: string
  pageTitle: string
  product: string
  form: PriceForm
}

const CMS_PRODUCTS: CmsProduct[] = [
  {
    name: 'SE_HOME',
    market: MarketLabel.SE,
    displayName: 'Home insurance villa', // TODO: should be a translation key (or translated from BE)
    slug: 'home',
    pageTitle: 'Home insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: 'SE_HOME',
    form: SWEDEN_APARTMENT_FORM,
  },
  {
    name: 'SE_CAR',
    market: MarketLabel.SE,
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    slug: 'car',
    pageTitle: 'Car insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: 'SE_CAR',
    form: SWEDEN_CAR_FORM,
  },
  {
    name: 'SE_CAR',
    market: MarketLabel.SE,
    displayName: 'Car insurance', // TODO: should be a translation key (or translated from BE)
    slug: 'car',
    pageTitle: 'Car insurance | Hedvig', // TODO: should be a translation key (or translated from BE)
    product: 'SE_CAR',
  },
]

export const getProductByMarketAndSlug = (market: MarketLabel, slug: string): CmsProduct | null => {
  return CMS_PRODUCTS.find((product) => product.market === market && product.slug === slug) ?? null
}

export const getProductsByMarket = (market: MarketLabel): CmsProduct[] => {
  return CMS_PRODUCTS.filter((product) => product.market === market)
}
