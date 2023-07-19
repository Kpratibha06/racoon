import styled from '@emotion/styled'
import { Space, theme } from 'ui'
import { CampaignDiscountType, CartFragmentFragment } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { CampaignsSection } from './CampaignsSection'
import { CartEntryItem } from './CartEntryItem/CartEntryItem'
import { CartEntryList } from './CartEntryList'
import { useGetDiscountDurationExplanation } from './CartInventory.helpers'
import { CostSummary } from './CostSummary'
import { ReadOnlyCampaignCodeList } from './ReadOnlyCampaignCodeList'

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  readOnly?: boolean
}

export const CartInventory = ({ shopSessionId, cart, readOnly = false }: Props) => {
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()
  const getDiscountExplanation = useGetDiscountExplanation()

  const campaigns = cart.redeemedCampaign
    ? [
        {
          id: cart.redeemedCampaign.id,
          code: cart.redeemedCampaign.code,
          discountExplanation: getDiscountExplanation(cart.redeemedCampaign.discount),
          discountDurationExplanation: getDiscountDurationExplanation(
            cart.redeemedCampaign.discount,
            cart.cost.gross,
          ),
        },
      ]
    : []

  const cost = {
    total: getCartTotal(cart),
    crossOut: getCartCrossOut(cart),
  }

  return (
    <Space y={1.5}>
      <CartEntryList>
        {cart.entries.map((item) => (
          <CartEntryItem
            key={item.id}
            offerId={item.id}
            title={item.variant.product.displayNameFull}
            cost={item.cost}
            pillow={{
              src: item.variant.product.pillowImage.src,
              alt: item.variant.product.pillowImage.alt ?? '',
            }}
            documents={item.variant.documents}
            productName={item.variant.product.name}
            data={item.priceIntentData}
            shopSessionId={shopSessionId}
            startDate={convertToDate(item.startDate)}
            readOnly={readOnly}
          />
        ))}
      </CartEntryList>
      {!readOnly && (
        <>
          <CampaignsSection shopSessionId={shopSessionId} campaigns={campaigns} />
          <HorizontalLine />
        </>
      )}
      {readOnly && campaigns.length > 0 && (
        <>
          <ReadOnlyCampaignCodeList campaigns={campaigns} />
          <HorizontalLine />
        </>
      )}

      <CostSummary {...cost} campaigns={campaigns} />
    </Space>
  )
}

const getCartTotal = (cart: CartFragmentFragment) => {
  if (!cart.redeemedCampaign) return cart.cost.net

  switch (cart.redeemedCampaign.discount.type) {
    case CampaignDiscountType.FreeMonths:
      return cart.cost.discount
    default:
      return cart.cost.net
  }
}

const getCartCrossOut = (cart: CartFragmentFragment) => {
  const hasDiscount = cart.cost.discount.amount > 0

  if (!hasDiscount || !cart.redeemedCampaign) return undefined

  switch (cart.redeemedCampaign.discount.type) {
    case CampaignDiscountType.FreeMonths:
    case CampaignDiscountType.MonthlyPercentage:
      return cart.cost.gross
    case CampaignDiscountType.IndefinitePercentage:
    case CampaignDiscountType.MonthlyCost:
      return cart.cost.discount
  }
}

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})
