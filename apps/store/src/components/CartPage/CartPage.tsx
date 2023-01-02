import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { Button, CrossIcon, Heading, Space, Text } from 'ui'
import { CampaignCodeList } from '@/components/CartInventory/CampaignCodeList'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CartPageProps } from './CartPageProps.types'
import { useStartCheckout } from './useStartCheckout'

export const CartPage = (props: CartPageProps) => {
  const { shopSessionId, cartId, entries, campaigns, cost, prevURL } = props
  const { shopSession } = useShopSession()
  const { t } = useTranslation()

  const tracking = useTracking()
  useEffect(() => {
    const { cart } = shopSession ?? {}
    if (cart) {
      tracking.reportViewCart(cart)
    } else {
      datadogLogs.logger.error('No cart data on cartPage')
    }
  }, [tracking, shopSession])

  const router = useRouter()
  const [startCheckout, { loading: loadingStartCheckout }] = useStartCheckout({
    shopSessionId,
    onCompleted() {
      router.push(PageLink.checkout())
    },
  })

  if (entries.length === 0) {
    return (
      <EmptyState prevURL={prevURL}>
        <Space y={1.5}>
          <HorizontalLine />
          <CampaignCodeList cartId={cartId} campaigns={campaigns} />
          <HorizontalLine />
          <CostSummary {...cost} campaigns={campaigns} />
        </Space>
      </EmptyState>
    )
  }

  return (
    <Wrapper>
      <Space y={1.5}>
        <Header prevURL={prevURL} />

        <CartEntryList>
          {entries.map((item) => (
            <CartEntryItem key={item.offerId} cartId={cartId} {...item} />
          ))}
        </CartEntryList>
        <HorizontalLine />
        <CampaignCodeList cartId={cartId} campaigns={campaigns} />
        <HorizontalLine />
        <CostSummary {...cost} campaigns={campaigns} />

        <Button onClick={() => startCheckout()} disabled={loadingStartCheckout}>
          {t('CHECKOUT_BUTTON')}
        </Button>
      </Space>
    </Wrapper>
  )
}

type EmptyStateProps = { children: ReactNode; prevURL: string }

const EmptyState = ({ children, prevURL }: EmptyStateProps) => {
  const { t } = useTranslation('cart')
  const { routingLocale } = useCurrentLocale()

  return (
    <Wrapper>
      <Space y={5}>
        <Header prevURL={prevURL} />

        <Space y={2}>
          <Space y={1}>
            <CenteredText>¯\_(ツ)_/¯</CenteredText>
            <Text align="center" color="textSecondary">
              {t('CART_EMPTY_SUMMARY')}
            </Text>
          </Space>

          <Link href={PageLink.store({ locale: routingLocale })} passHref legacyBehavior>
            <Button>{t('GO_TO_STORE_BUTTON')}</Button>
          </Link>
        </Space>

        {children}
      </Space>
    </Wrapper>
  )
}

type HeaderProps = { prevURL: string }

const Header = ({ prevURL }: HeaderProps) => {
  const { t } = useTranslation('cart')

  return (
    <StyledHeader>
      <Heading as="h1" variant="standard.24">
        {t('CART_PAGE_HEADING')}
      </Heading>

      <Link href={prevURL}>
        <CrossIcon size="1.5rem" />
      </Link>
    </StyledHeader>
  )
}

const StyledHeader = styled.div({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Wrapper = styled.div(({ theme }) => ({
  width: '100%',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[7],
}))

const CenteredText = styled(Text)({ textAlign: 'center' })

const HorizontalLine = styled.hr(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  height: 1,
}))
