import type { NextPage } from 'next'
import { SSRConfig } from 'next-i18next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

type PageWithLayout<T = Record<string, unknown>> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

declare module 'next' {
  export type NextPageWithLayout<T = Record<string, unknown>> = PageWithLayout<T>
}

type GlobalAppProps = SSRConfig & {
  shopSessionId?: string
}

declare module 'next/app' {
  export type AppPropsWithLayout = AppProps<GlobalAppProps> & {
    Component: PageWithLayout
  }
}

type TrustlyInitFunction = (
  endUserID: string,
  merchantUsername: string,
  merchantCallback: MerchantCallbackFunction,
  options?: TrustlyOptions,
) => Promise<TrustlyInitStatus>
type TrustlyInitStatus = 'FirstTimeUser' | 'ReturningUser'

type MerchantCallbackFunction = (data: MerchantCallbackData) => void
type MerchantCallbackData = { accountId: string }
type TrustlyOptions = { locale: string }

declare global {
  interface Window {
    TrustlyWidget: {
      init: TrustlyInitFunction
    }
    dataLayer: DataLayerObject[]
  }
}
