import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { EditActionButton } from './EditActionButton'
import { RemoveActionButton } from './RemoveActionButton'
import { useGetStartDateProps } from './useGetStartDateProps'

type Props = {
  shopSessionId: string
  offer: ProductOfferFragment
}

export const ProductItemContainer = (props: Props) => {
  const { t } = useTranslation('cart')
  const getStartDateProps = useGetStartDateProps()

  const title = props.offer.variant.product.displayNameFull

  const hasDiscount = props.offer.cost.discount.amount > 0
  const price = {
    currencyCode: props.offer.cost.net.currencyCode,
    amount: props.offer.cost.gross.amount,
    reducedAmount: hasDiscount ? props.offer.cost.net.amount : undefined,
  }

  const startDateProps = getStartDateProps({
    productName: props.offer.variant.product.name,
    data: props.offer.priceIntentData,
    startDate: props.offer.startDate,
  })

  const productDetails = useMemo(() => {
    const items = props.offer.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    }))
    const tierLevelDisplayName = getTierLevelDisplayName(props.offer)
    if (tierLevelDisplayName) {
      items.push({ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName })
    }
    const deductibleDisplayName = props.offer.deductible?.displayName
    if (deductibleDisplayName) {
      items.push({ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: deductibleDisplayName })
    }
    return items
  }, [props.offer, t])

  const productDocuments = props.offer.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  return (
    <ProductItem
      title={title}
      pillowSrc={props.offer.variant.product.pillowImage.src}
      price={price}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
    >
      <EditActionButton shopSessionId={props.shopSessionId} offer={props.offer} />
      <RemoveActionButton
        shopSessionId={props.shopSessionId}
        offerId={props.offer.id}
        title={title}
      />
    </ProductItem>
  )
}

const getTierLevelDisplayName = (item: ProductOfferFragment) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.variant.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
