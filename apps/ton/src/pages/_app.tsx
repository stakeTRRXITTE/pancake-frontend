import { TonConnector } from 'components/connector/TonConnector'
import { Header } from 'components/Header'
import { Providers } from 'components/Providers'
import type { AppProps } from 'next/app'
import '../styles/globals.css' // Import global CSS

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <TonConnector>
      <>
        <Header />
        {/* Add a global layout or wrapper */}
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </>
    </TonConnector>
  )
}

export default MyApp
