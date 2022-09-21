import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { useHandleSubmitStartDates } from '@/components/CheckoutPage/useHandleSubmitStartDates'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

type NextPageProps = Omit<CheckoutPageProps, 'loading'> & {
  cartId: string
}

const NextCheckoutPage: NextPage<NextPageProps> = ({ cartId, products, ...props }) => {
  const router = useRouter()
  const [handleSubmit, { loading, data }] = useHandleSubmitStartDates({
    cartId,
    products,
    onSuccess() {
      router.push(PageLink.checkoutContactDetails())
    },
  })

  const { userErrors } = data?.cartEntriesStartDateUpdate ?? {}

  const productsWithErrors = products.map((product) => {
    const error = userErrors?.find((error) => product.pricedVariantId === error.pricedVariantId)
    return {
      errorMessage: error?.message,
      ...product,
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <CheckoutPage {...props} loading={loading} products={productsWithErrors} />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context

  if (!locale || locale === 'default') return { notFound: true }

  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({
      req,
      res,
      apolloClient,
    })

    const cartCost = shopSession.cart.cost
    const total = parseInt(cartCost.total.amount, 10)
    const subTotal = parseInt(cartCost.subtotal.amount, 10)
    const crossOut = total !== subTotal ? subTotal : undefined

    const cost: CheckoutPageProps['cost'] = { total, subTotal }
    if (crossOut) cost.crossOut = crossOut

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        shopSessionId: shopSession.id,
        cartId: shopSession.cart.id,
        products: shopSession.cart.entries.map((pricedVariant) => ({
          pricedVariantId: pricedVariant.id,
          name: pricedVariant.title,
          cost: parseInt(pricedVariant.price.amount, 10) || 0,
          startDate: pricedVariant.startDate,
        })),
        cost,
        currency: shopSession.currencyCode,
      },
    }
  } catch (error) {
    console.error('Failed to get server side props for checkout page')
    console.error(error)
    return { notFound: true }
  }
}

export default NextCheckoutPage
