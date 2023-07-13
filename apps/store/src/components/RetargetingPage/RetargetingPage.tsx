import styled from '@emotion/styled'
import { type ComponentProps, useMemo } from 'react'
import { Heading, Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { usePriceIntentsQuery } from '@/services/apollo/generated'
import { MultiTierOffer } from './MultiTierOffer'
import { SingleTierOffer } from './SingleTierOffer'

type Props = {
  shopSessionId: string
}

type OfferSingle = ComponentProps<typeof SingleTierOffer> & { type: 'single' }
type OfferMultiple = ComponentProps<typeof MultiTierOffer> & { type: 'multiple' }
type Offer = (OfferSingle | OfferMultiple) & { key: string }

export const RetargetingPage = (props: Props) => {
  const result = usePriceIntentsQuery({ variables: { shopSessionId: props.shopSessionId } })

  const offers = useMemo(() => {
    if (!result.data) return []

    const cartOffers = new Set(result.data.shopSession.cart.entries.map((item) => item.id))

    return result.data.shopSession.priceIntents.reduce<Array<Offer>>((total, item) => {
      if (item.offers.some((offer) => cartOffers.has(offer.id))) {
        return total
      }

      if (item.offers.length === 1) {
        total.push({
          key: item.id,
          type: 'single',
          product: item.offers[0].variant.product,
          offer: item.offers[0],
        })
      } else if (item.offers.length > 1) {
        total.push({
          key: item.id,
          type: 'multiple',
          product: item.offers[0].variant.product,
          defaultOffer: item.offers[0],
          offers: item.offers,
        })
      }

      return total
    }, [])
  }, [result.data])

  return (
    <GridLayout.Root>
      <GridLayoutContent width={{ md: '2/3', lg: '1/2', xl: '1/3' }} align="center">
        <Space y={2}>
          <Heading as="h1" variant={{ _: 'serif.40' }} align="center">
            Your current offers
          </Heading>

          <List>
            {offers.map((item) => (
              <li key={item.key}>
                {item.type === 'single' && <SingleTierOffer {...item} />}
                {item.type === 'multiple' && <MultiTierOffer {...item} />}
              </li>
            ))}
          </List>
        </Space>
      </GridLayoutContent>
    </GridLayout.Root>
  )
}

const GridLayoutContent = styled(GridLayout.Content)({
  paddingBlock: theme.space.lg,
  minHeight: '60vh',
})

const List = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
})
