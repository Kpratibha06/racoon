import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getCDNFonts } from 'ui'
import { GTMBodyScript } from '@/lib/gtm'
import { getLocaleOrFallback } from '@/lib/l10n/locales'

export default class MyDocument extends Document {
  lang(): string {
    return getLocaleOrFallback(this.props.locale).language
  }

  render() {
    return (
      <Html lang={this.lang()}>
        <Head>
          {getCDNFonts().map((font) => (
            <link
              key={font.src}
              rel="preload"
              href={font.src}
              as="font"
              type={`font/${font.format}`}
              crossOrigin="anonymous"
            />
          ))}
        </Head>
        <body>
          <GTMBodyScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
