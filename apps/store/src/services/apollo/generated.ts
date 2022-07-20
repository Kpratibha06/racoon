import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  AdyenPaymentDetailsInput: any
  AdyenPaymentMethodsResponse: any
  DateTime: any
  JSON: any
}

export type Cart = {
  __typename?: 'Cart'
  buyerIdentity: CartBuyerIdentity
  id: Scalars['ID']
  /** Explanation: https://docs.drupalcommerce.org/commerce1/user-guide/shopping-cart/shopping-carts-orders-and-line-items */
  lines: Array<CartLine>
}

export type CartBuyerIdentity = {
  __typename?: 'CartBuyerIdentity'
  countryCode: CountryCode
}

export type CartBuyerIdentityInput = {
  countryCode: CountryCode
}

export type CartCreateInput = {
  buyerIdentity: CartBuyerIdentityInput
}

export type CartCreatePayload = {
  __typename?: 'CartCreatePayload'
  cart?: Maybe<Cart>
  userErrors: Array<CartUserError>
}

export enum CartErrorCode {
  Invalid = 'INVALID',
}

export type CartLine = {
  __typename?: 'CartLine'
  id: Scalars['ID']
  price: Money
  variant: ProductVariant
}

export type CartLinesAddPayload = {
  __typename?: 'CartLinesAddPayload'
  cart?: Maybe<Cart>
  userErrors: Array<CartUserError>
}

export type CartLinesRemovePayload = {
  __typename?: 'CartLinesRemovePayload'
  cart?: Maybe<Cart>
  userErrors: Array<CartUserError>
}

export type CartUserError = {
  __typename?: 'CartUserError'
  /** The error code. */
  code?: Maybe<CartErrorCode>
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<Scalars['String']>>
  /** The error message. */
  message: Scalars['String']
}

/** A container for all the information required to checkout items and pay. */
export type Checkout = {
  __typename?: 'Checkout'
  buyerIdentity: CheckoutBuyerIdentity
  /** The date and time when the checkout was completed. */
  completedAt?: Maybe<Scalars['DateTime']>
  /** The date and time when the checkout was created. */
  createdAt: Scalars['DateTime']
  /** The currency code for the checkout. */
  currencyCode: CurrencyCode
  id: Scalars['ID']
}

/** The identity of the customer associated with the checkout. */
export type CheckoutBuyerIdentity = {
  __typename?: 'CheckoutBuyerIdentity'
  /** The code designating a country/region, following ISO 3166-1 alpha-2 guidelines. */
  countryCode: CountryCode
  person?: Maybe<CheckoutPerson>
}

export type CheckoutBuyerIdentityInput = {
  countryCode: CountryCode
}

export type CheckoutCompleteFreePayload = {
  __typename?: 'CheckoutCompleteFreePayload'
  checkout?: Maybe<Checkout>
  memberAccessToken?: Maybe<Scalars['String']>
  userErrors: Array<CheckoutUserError>
}

export type CheckoutCompleteWithPaymentPayload = {
  __typename?: 'CheckoutCompleteWithPaymentPayload'
  checkout?: Maybe<Checkout>
  memberAccessToken?: Maybe<Scalars['String']>
  userErrors: Array<CheckoutUserError>
}

export type CheckoutCreateInput = {
  buyerIdentity: CheckoutBuyerIdentityInput
}

export type CheckoutCreatePayload = {
  __typename?: 'CheckoutCreatePayload'
  /** The new checkout object. */
  checkout?: Maybe<Checkout>
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<CheckoutUserError>
}

/** Possible error codes that can be returned by CheckoutUserError. */
export enum CheckoutErrorCode {
  /** The input value is invalid. */
  Invalid = 'INVALID',
}

export type CheckoutPerson = {
  __typename?: 'CheckoutPerson'
  email: Scalars['String']
  firstName: Scalars['String']
  id: Scalars['ID']
  lastName: Scalars['String']
  personalNumber: Scalars['String']
}

export type CheckoutPersonCreateInput = {
  /** The customer's email. */
  email: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
  personalNumber: Scalars['String']
}

export type CheckoutPersonCreatePayload = {
  __typename?: 'CheckoutPersonCreatePayload'
  checkout?: Maybe<Checkout>
  userErrors: Array<CheckoutUserError>
}

/** Represents an error that happens during execution of a checkout mutation. */
export type CheckoutUserError = {
  __typename?: 'CheckoutUserError'
  /** The error code. */
  code?: Maybe<CheckoutErrorCode>
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<Scalars['String']>>
  /** The error message. */
  message: Scalars['String']
}

export enum CountryCode {
  Dk = 'DK',
  No = 'NO',
  Se = 'SE',
}

/**
 * The three-letter currency codes that represent the world currencies used in stores.
 * These include standard ISO 4217 codes, legacy codes, and non-standard codes.
 */
export enum CurrencyCode {
  /** Danish Kroner (DKK). */
  Dkk = 'DKK',
  /** Norwegian Kroner (NOK). */
  Nok = 'NOK',
  /** Swedish Kronor (SEK). */
  Sek = 'SEK',
}

export type Location = {
  __typename?: 'Location'
  /** A short description about the location */
  description: Scalars['String']
  id: Scalars['ID']
  /** The name of the location */
  name: Scalars['String']
  /** The calculated overall rating based on all reviews */
  overallRating?: Maybe<Scalars['Float']>
  /** The location's main photo as a URL */
  photo: Scalars['String']
  /** All submitted reviews about this location */
  reviewsForLocation: Array<Maybe<Review>>
}

export type LocationReviewInput = {
  /** Written text */
  comment: Scalars['String']
  /** Location Id */
  locationId: Scalars['String']
  /** A number from 1 - 5 with 1 being lowest and 5 being highest */
  rating: Scalars['Int']
}

export type Money = {
  __typename?: 'Money'
  amount: Scalars['Int']
  currencyCode: CurrencyCode
}

export type Mutation = {
  __typename?: 'Mutation'
  _empty?: Maybe<Scalars['String']>
  cartCreate: CartCreatePayload
  cartLinesAdd: CartLinesAddPayload
  cartLinesRemove: CartLinesRemovePayload
  checkoutCompleteFree: CheckoutCompleteFreePayload
  checkoutCompleteWithPayment: CheckoutCompleteWithPaymentPayload
  /** Creates a new checkout. */
  checkoutCreate: CheckoutCreatePayload
  checkoutPersonCreate: CheckoutPersonCreatePayload
  paymentConnectionCreate: PaymentConnectionCreatePayload
  paymentConnectionRegisterDirectDebit: PaymentConnectionRegisterDirectDebitPayload
  paymentConnectionSubmitAdditionalPaymentDetails: PaymentConnectionSubmitAdditionalPaymentDetailsPayload
  paymentConnectionSubmitRedirection: PaymentConnectionSubmitRedirectionPayload
  personAddFriends: Scalars['Boolean']
  personCreate: Person
  priceIntent?: Maybe<PriceIntentMutations>
  shopSession?: Maybe<ShopSessionMutations>
  submitReview?: Maybe<SubmitReviewResponse>
}

export type MutationCartCreateArgs = {
  input: CartCreateInput
}

export type MutationCartLinesAddArgs = {
  cartId: Scalars['ID']
  lineIds: Array<Scalars['ID']>
}

export type MutationCartLinesRemoveArgs = {
  cartId: Scalars['ID']
  lineIds: Array<Scalars['ID']>
}

export type MutationCheckoutCompleteFreeArgs = {
  checkoutId: Scalars['ID']
}

export type MutationCheckoutCompleteWithPaymentArgs = {
  checkout: Scalars['ID']
  paymentConnectionId: Scalars['ID']
}

export type MutationCheckoutCreateArgs = {
  input: CheckoutCreateInput
}

export type MutationCheckoutPersonCreateArgs = {
  checkoutId: Scalars['ID']
  person: CheckoutPersonCreateInput
}

export type MutationPaymentConnectionCreateArgs = {
  input: PaymentConnectionCreateInput
}

export type MutationPaymentConnectionRegisterDirectDebitArgs = {
  input: PaymentConnectionRegisterDirectDebitInput
  paymentConnectionId: Scalars['ID']
}

export type MutationPaymentConnectionSubmitAdditionalPaymentDetailsArgs = {
  input: PaymentConnectionSubmitAdditionalPaymentDetailsInput
  paymentConnectionId: Scalars['ID']
}

export type MutationPaymentConnectionSubmitRedirectionArgs = {
  input: PaymentConnectionSubmitRedirectionInput
  paymentConnectionId: Scalars['ID']
}

export type MutationPersonAddFriendsArgs = {
  id1: Scalars['ID']
  id2: Scalars['ID']
}

export type MutationPersonCreateArgs = {
  name: Scalars['String']
}

export type MutationSubmitReviewArgs = {
  locationReview?: InputMaybe<LocationReviewInput>
}

export type PaymentConnection = {
  __typename?: 'PaymentConnection'
  id: Scalars['ID']
  providers: Array<PaymentConnectionProvider>
}

export type PaymentConnectionCreateInput = {
  countryCode: CountryCode
}

export type PaymentConnectionCreatePayload = {
  __typename?: 'PaymentConnectionCreatePayload'
  paymentConnection?: Maybe<PaymentConnection>
  userErrors: Array<PaymentConnectionUserError>
}

export enum PaymentConnectionErrorCode {
  Invalid = 'INVALID',
}

export type PaymentConnectionProvider =
  | PaymentConnectionProviderAdyen
  | PaymentConnectionProviderTrustly

export type PaymentConnectionProviderAdyen = {
  __typename?: 'PaymentConnectionProviderAdyen'
  paymentMethodsResponse: Scalars['AdyenPaymentMethodsResponse']
  type?: Maybe<PaymentConnectionProviderType>
}

export type PaymentConnectionProviderTrustly = {
  __typename?: 'PaymentConnectionProviderTrustly'
  type?: Maybe<PaymentConnectionProviderType>
}

export enum PaymentConnectionProviderType {
  Adyen = 'ADYEN',
  Trustly = 'TRUSTLY',
}

export type PaymentConnectionRegisterDirectDebitInput = {
  failureURL: Scalars['String']
  successURL: Scalars['String']
}

export type PaymentConnectionRegisterDirectDebitPayload = {
  __typename?: 'PaymentConnectionRegisterDirectDebitPayload'
  paymentConnection?: Maybe<PaymentConnection>
  userErrors: Array<PaymentConnectionUserError>
}

export type PaymentConnectionSubmitAdditionalPaymentDetailsInput = {
  paymentDetailsInput: Scalars['AdyenPaymentDetailsInput']
}

export type PaymentConnectionSubmitAdditionalPaymentDetailsPayload = {
  __typename?: 'PaymentConnectionSubmitAdditionalPaymentDetailsPayload'
  paymentConnection?: Maybe<PaymentConnection>
  userErrors: Array<PaymentConnectionUserError>
}

export type PaymentConnectionSubmitRedirectionInput = {
  md: Scalars['String']
  pares: Scalars['String']
}

export type PaymentConnectionSubmitRedirectionPayload = {
  __typename?: 'PaymentConnectionSubmitRedirectionPayload'
  paymentConnection?: Maybe<PaymentConnection>
  userErrors: Array<PaymentConnectionUserError>
}

export type PaymentConnectionUserError = {
  __typename?: 'PaymentConnectionUserError'
  /** The error code. */
  code?: Maybe<PaymentConnectionErrorCode>
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<Scalars['String']>>
  /** The error message. */
  message: Scalars['String']
}

export type Person = {
  __typename?: 'Person'
  friends: Array<Person>
  id: Scalars['ID']
  name: Scalars['String']
}

export type PriceIntent = {
  __typename?: 'PriceIntent'
  /** Submitted user form data. */
  data: Scalars['JSON']
  /** The id of the price intent. */
  id: Scalars['ID']
  /** Line items added based on the data-field. */
  lines?: Maybe<Array<PriceIntentLine>>
}

export type PriceIntentConfirmPayload = {
  __typename?: 'PriceIntentConfirmPayload'
  priceIntent?: Maybe<PriceIntent>
  userErrors: Array<PriceIntentUserError>
}

export type PriceIntentCreateInput = {
  /** The product to calculate price for. */
  productId: Scalars['ID']
  /** The current shop session. */
  shopSessionId: Scalars['ID']
}

export type PriceIntentCreatePayload = {
  __typename?: 'PriceIntentCreatePayload'
  /** The new price intent object. */
  priceIntent?: Maybe<PriceIntent>
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<PriceIntentUserError>
}

export type PriceIntentDataUpdatePayload = {
  __typename?: 'PriceIntentDataUpdatePayload'
  priceIntent?: Maybe<PriceIntent>
  userErrors: Array<PriceIntentUserError>
}

export enum PriceIntentErrorCode {
  /** The input value is invalid. */
  Invalid = 'INVALID',
}

export type PriceIntentLine = {
  __typename?: 'PriceIntentLine'
  /** The id of the line item, which can be used to add to cart. */
  id: Scalars['ID']
  /** The cost of the product variant. */
  price: Money
  /** The relevant product variant (tier). */
  variant: ProductVariant
}

export type PriceIntentMutations = {
  __typename?: 'PriceIntentMutations'
  /** Generates line items with price based on user form data. */
  confirm: PriceIntentConfirmPayload
  /** Creates a new price intent. */
  create: PriceIntentCreatePayload
  /** Updates user form data. */
  dataUpdate: PriceIntentDataUpdatePayload
}

export type PriceIntentMutationsConfirmArgs = {
  priceIntentId: Scalars['ID']
}

export type PriceIntentMutationsCreateArgs = {
  input: PriceIntentCreateInput
}

export type PriceIntentMutationsDataUpdateArgs = {
  data: Scalars['JSON']
  priceIntentId: Scalars['ID']
}

export type PriceIntentUserError = {
  __typename?: 'PriceIntentUserError'
  /** The error code. */
  code?: Maybe<PriceIntentErrorCode>
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<Scalars['String']>>
  /** The error message. */
  message: Scalars['String']
}

export type Product = {
  __typename?: 'Product'
  id: Scalars['ID']
  title: Scalars['String']
  variants: Array<ProductVariant>
}

export type ProductVariant = {
  __typename?: 'ProductVariant'
  id: Scalars['ID']
  product: Product
  title: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  _empty?: Maybe<Scalars['String']>
  cart?: Maybe<Cart>
  checkout?: Maybe<Checkout>
  /** The three latest reviews submitted for FlyBy's locations */
  latestReviews: Array<Review>
  /** The details of a specific location */
  location?: Maybe<Location>
  /** The full list of locations presented by the Interplanetary Space Tourism department */
  locations: Array<Location>
  paymentConnection?: Maybe<PaymentConnection>
  person: Person
  /** Get a price intent by its ID. */
  priceIntent?: Maybe<PriceIntent>
  shopSession: ShopSession
}

export type QueryCartArgs = {
  id: Scalars['ID']
}

export type QueryCheckoutArgs = {
  id: Scalars['ID']
}

export type QueryLocationArgs = {
  id: Scalars['ID']
}

export type QueryPaymentConnectionArgs = {
  id: Scalars['ID']
}

export type QueryPersonArgs = {
  id: Scalars['ID']
}

export type QueryPriceIntentArgs = {
  id: Scalars['ID']
}

export type QueryShopSessionArgs = {
  id: Scalars['ID']
}

export type Review = {
  __typename?: 'Review'
  /** Written text */
  comment?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** The location the review is about */
  location?: Maybe<Location>
  /** A number from 1 - 5 with 1 being lowest and 5 being highest */
  rating?: Maybe<Scalars['Int']>
}

export type ShopSession = {
  __typename?: 'ShopSession'
  id: Scalars['ID']
}

export type ShopSessionCreatePayload = {
  __typename?: 'ShopSessionCreatePayload'
  shopSession?: Maybe<ShopSession>
  userErrors?: Maybe<Array<ShopSessionUserError>>
}

export enum ShopSessionErrorCode {
  Invalid = 'INVALID',
}

export type ShopSessionMutations = {
  __typename?: 'ShopSessionMutations'
  create: ShopSessionCreatePayload
}

export type ShopSessionUserError = {
  __typename?: 'ShopSessionUserError'
  /** The error code. */
  code?: Maybe<ShopSessionErrorCode>
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<Scalars['String']>>
  /** The error message. */
  message: Scalars['String']
}

export type SubmitReviewResponse = {
  __typename?: 'SubmitReviewResponse'
  /** Similar to HTTP status code, represents the status of the mutation */
  code: Scalars['Int']
  /** Newly created review */
  locationReview?: Maybe<Review>
  /** Human-readable message for the UI */
  message: Scalars['String']
  /** Indicates whether the mutation was successful */
  success: Scalars['Boolean']
}

export type PriceIntentQueryVariables = Exact<{
  priceIntentId: Scalars['ID']
}>

export type PriceIntentQuery = {
  __typename?: 'Query'
  priceIntent?: {
    __typename?: 'PriceIntent'
    id: string
    data: any
    lines?: Array<{
      __typename?: 'PriceIntentLine'
      id: string
      price: { __typename?: 'Money'; amount: number; currencyCode: CurrencyCode }
      variant: { __typename?: 'ProductVariant'; id: string; title: string }
    }> | null
  } | null
}

export type PriceIntentConfirmMutationVariables = Exact<{
  priceIntentId: Scalars['ID']
}>

export type PriceIntentConfirmMutation = {
  __typename?: 'Mutation'
  priceIntent?: {
    __typename?: 'PriceIntentMutations'
    confirm: {
      __typename?: 'PriceIntentConfirmPayload'
      priceIntent?: {
        __typename?: 'PriceIntent'
        id: string
        data: any
        lines?: Array<{
          __typename?: 'PriceIntentLine'
          id: string
          price: { __typename?: 'Money'; amount: number; currencyCode: CurrencyCode }
          variant: { __typename?: 'ProductVariant'; id: string; title: string }
        }> | null
      } | null
      userErrors: Array<{
        __typename?: 'PriceIntentUserError'
        code?: PriceIntentErrorCode | null
        field?: Array<string> | null
        message: string
      }>
    }
  } | null
}

export type PriceIntentCreateMutationVariables = Exact<{
  shopSessionId: Scalars['ID']
  productId: Scalars['ID']
}>

export type PriceIntentCreateMutation = {
  __typename?: 'Mutation'
  priceIntent?: {
    __typename?: 'PriceIntentMutations'
    create: {
      __typename?: 'PriceIntentCreatePayload'
      priceIntent?: {
        __typename?: 'PriceIntent'
        id: string
        data: any
        lines?: Array<{
          __typename?: 'PriceIntentLine'
          id: string
          price: { __typename?: 'Money'; amount: number; currencyCode: CurrencyCode }
          variant: { __typename?: 'ProductVariant'; id: string; title: string }
        }> | null
      } | null
      userErrors: Array<{
        __typename?: 'PriceIntentUserError'
        code?: PriceIntentErrorCode | null
        field?: Array<string> | null
        message: string
      }>
    }
  } | null
}

export type PriceIntentDataUpdateMutationVariables = Exact<{
  priceIntentId: Scalars['ID']
  data: Scalars['JSON']
}>

export type PriceIntentDataUpdateMutation = {
  __typename?: 'Mutation'
  priceIntent?: {
    __typename?: 'PriceIntentMutations'
    dataUpdate: {
      __typename?: 'PriceIntentDataUpdatePayload'
      priceIntent?: {
        __typename?: 'PriceIntent'
        id: string
        data: any
        lines?: Array<{
          __typename?: 'PriceIntentLine'
          id: string
          price: { __typename?: 'Money'; amount: number; currencyCode: CurrencyCode }
          variant: { __typename?: 'ProductVariant'; id: string; title: string }
        }> | null
      } | null
      userErrors: Array<{
        __typename?: 'PriceIntentUserError'
        code?: PriceIntentErrorCode | null
        field?: Array<string> | null
        message: string
      }>
    }
  } | null
}

export type PriceIntentFragmentFragment = {
  __typename?: 'PriceIntent'
  id: string
  data: any
  lines?: Array<{
    __typename?: 'PriceIntentLine'
    id: string
    price: { __typename?: 'Money'; amount: number; currencyCode: CurrencyCode }
    variant: { __typename?: 'ProductVariant'; id: string; title: string }
  }> | null
}

export type ShopSessionQueryVariables = Exact<{
  shopSessionId: Scalars['ID']
}>

export type ShopSessionQuery = {
  __typename?: 'Query'
  shopSession: { __typename?: 'ShopSession'; id: string }
}

export type ShopSessionCreateMutationVariables = Exact<{ [key: string]: never }>

export type ShopSessionCreateMutation = {
  __typename?: 'Mutation'
  shopSession?: {
    __typename?: 'ShopSessionMutations'
    create: {
      __typename?: 'ShopSessionCreatePayload'
      shopSession?: { __typename?: 'ShopSession'; id: string } | null
    }
  } | null
}

export const PriceIntentFragmentFragmentDoc = gql`
  fragment PriceIntentFragment on PriceIntent {
    id
    data
    lines {
      id
      price {
        amount
        currencyCode
      }
      variant {
        id
        title
      }
    }
  }
`
export const PriceIntentDocument = gql`
  query PriceIntent($priceIntentId: ID!) {
    priceIntent(id: $priceIntentId) {
      ...PriceIntentFragment
    }
  }
  ${PriceIntentFragmentFragmentDoc}
`

/**
 * __usePriceIntentQuery__
 *
 * To run a query within a React component, call `usePriceIntentQuery` and pass it any options that fit your needs.
 * When your component renders, `usePriceIntentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePriceIntentQuery({
 *   variables: {
 *      priceIntentId: // value for 'priceIntentId'
 *   },
 * });
 */
export function usePriceIntentQuery(
  baseOptions: Apollo.QueryHookOptions<PriceIntentQuery, PriceIntentQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PriceIntentQuery, PriceIntentQueryVariables>(PriceIntentDocument, options)
}
export function usePriceIntentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PriceIntentQuery, PriceIntentQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PriceIntentQuery, PriceIntentQueryVariables>(
    PriceIntentDocument,
    options,
  )
}
export type PriceIntentQueryHookResult = ReturnType<typeof usePriceIntentQuery>
export type PriceIntentLazyQueryHookResult = ReturnType<typeof usePriceIntentLazyQuery>
export type PriceIntentQueryResult = Apollo.QueryResult<PriceIntentQuery, PriceIntentQueryVariables>
export const PriceIntentConfirmDocument = gql`
  mutation PriceIntentConfirm($priceIntentId: ID!) {
    priceIntent {
      confirm(priceIntentId: $priceIntentId) {
        priceIntent {
          ...PriceIntentFragment
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  }
  ${PriceIntentFragmentFragmentDoc}
`
export type PriceIntentConfirmMutationFn = Apollo.MutationFunction<
  PriceIntentConfirmMutation,
  PriceIntentConfirmMutationVariables
>

/**
 * __usePriceIntentConfirmMutation__
 *
 * To run a mutation, you first call `usePriceIntentConfirmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePriceIntentConfirmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [priceIntentConfirmMutation, { data, loading, error }] = usePriceIntentConfirmMutation({
 *   variables: {
 *      priceIntentId: // value for 'priceIntentId'
 *   },
 * });
 */
export function usePriceIntentConfirmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PriceIntentConfirmMutation,
    PriceIntentConfirmMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PriceIntentConfirmMutation, PriceIntentConfirmMutationVariables>(
    PriceIntentConfirmDocument,
    options,
  )
}
export type PriceIntentConfirmMutationHookResult = ReturnType<typeof usePriceIntentConfirmMutation>
export type PriceIntentConfirmMutationResult = Apollo.MutationResult<PriceIntentConfirmMutation>
export type PriceIntentConfirmMutationOptions = Apollo.BaseMutationOptions<
  PriceIntentConfirmMutation,
  PriceIntentConfirmMutationVariables
>
export const PriceIntentCreateDocument = gql`
  mutation PriceIntentCreate($shopSessionId: ID!, $productId: ID!) {
    priceIntent {
      create(input: { shopSessionId: $shopSessionId, productId: $productId }) {
        priceIntent {
          ...PriceIntentFragment
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  }
  ${PriceIntentFragmentFragmentDoc}
`
export type PriceIntentCreateMutationFn = Apollo.MutationFunction<
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables
>

/**
 * __usePriceIntentCreateMutation__
 *
 * To run a mutation, you first call `usePriceIntentCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePriceIntentCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [priceIntentCreateMutation, { data, loading, error }] = usePriceIntentCreateMutation({
 *   variables: {
 *      shopSessionId: // value for 'shopSessionId'
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function usePriceIntentCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PriceIntentCreateMutation,
    PriceIntentCreateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PriceIntentCreateMutation, PriceIntentCreateMutationVariables>(
    PriceIntentCreateDocument,
    options,
  )
}
export type PriceIntentCreateMutationHookResult = ReturnType<typeof usePriceIntentCreateMutation>
export type PriceIntentCreateMutationResult = Apollo.MutationResult<PriceIntentCreateMutation>
export type PriceIntentCreateMutationOptions = Apollo.BaseMutationOptions<
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables
>
export const PriceIntentDataUpdateDocument = gql`
  mutation PriceIntentDataUpdate($priceIntentId: ID!, $data: JSON!) {
    priceIntent {
      dataUpdate(priceIntentId: $priceIntentId, data: $data) {
        priceIntent {
          ...PriceIntentFragment
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  }
  ${PriceIntentFragmentFragmentDoc}
`
export type PriceIntentDataUpdateMutationFn = Apollo.MutationFunction<
  PriceIntentDataUpdateMutation,
  PriceIntentDataUpdateMutationVariables
>

/**
 * __usePriceIntentDataUpdateMutation__
 *
 * To run a mutation, you first call `usePriceIntentDataUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePriceIntentDataUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [priceIntentDataUpdateMutation, { data, loading, error }] = usePriceIntentDataUpdateMutation({
 *   variables: {
 *      priceIntentId: // value for 'priceIntentId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function usePriceIntentDataUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PriceIntentDataUpdateMutation,
    PriceIntentDataUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PriceIntentDataUpdateMutation, PriceIntentDataUpdateMutationVariables>(
    PriceIntentDataUpdateDocument,
    options,
  )
}
export type PriceIntentDataUpdateMutationHookResult = ReturnType<
  typeof usePriceIntentDataUpdateMutation
>
export type PriceIntentDataUpdateMutationResult =
  Apollo.MutationResult<PriceIntentDataUpdateMutation>
export type PriceIntentDataUpdateMutationOptions = Apollo.BaseMutationOptions<
  PriceIntentDataUpdateMutation,
  PriceIntentDataUpdateMutationVariables
>
export const ShopSessionDocument = gql`
  query ShopSession($shopSessionId: ID!) {
    shopSession(id: $shopSessionId) {
      id
    }
  }
`

/**
 * __useShopSessionQuery__
 *
 * To run a query within a React component, call `useShopSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useShopSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShopSessionQuery({
 *   variables: {
 *      shopSessionId: // value for 'shopSessionId'
 *   },
 * });
 */
export function useShopSessionQuery(
  baseOptions: Apollo.QueryHookOptions<ShopSessionQuery, ShopSessionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ShopSessionQuery, ShopSessionQueryVariables>(ShopSessionDocument, options)
}
export function useShopSessionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ShopSessionQuery, ShopSessionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ShopSessionQuery, ShopSessionQueryVariables>(
    ShopSessionDocument,
    options,
  )
}
export type ShopSessionQueryHookResult = ReturnType<typeof useShopSessionQuery>
export type ShopSessionLazyQueryHookResult = ReturnType<typeof useShopSessionLazyQuery>
export type ShopSessionQueryResult = Apollo.QueryResult<ShopSessionQuery, ShopSessionQueryVariables>
export const ShopSessionCreateDocument = gql`
  mutation ShopSessionCreate {
    shopSession {
      create {
        shopSession {
          id
        }
      }
    }
  }
`
export type ShopSessionCreateMutationFn = Apollo.MutationFunction<
  ShopSessionCreateMutation,
  ShopSessionCreateMutationVariables
>

/**
 * __useShopSessionCreateMutation__
 *
 * To run a mutation, you first call `useShopSessionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShopSessionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shopSessionCreateMutation, { data, loading, error }] = useShopSessionCreateMutation({
 *   variables: {
 *   },
 * });
 */
export function useShopSessionCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ShopSessionCreateMutation,
    ShopSessionCreateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ShopSessionCreateMutation, ShopSessionCreateMutationVariables>(
    ShopSessionCreateDocument,
    options,
  )
}
export type ShopSessionCreateMutationHookResult = ReturnType<typeof useShopSessionCreateMutation>
export type ShopSessionCreateMutationResult = Apollo.MutationResult<ShopSessionCreateMutation>
export type ShopSessionCreateMutationOptions = Apollo.BaseMutationOptions<
  ShopSessionCreateMutation,
  ShopSessionCreateMutationVariables
>
