import { Header } from 'components/Header'
import { Providers } from 'components/Providers'
import type { AppProps } from 'next/app'
import '../styles/globals.css' // Import global CSS

const MyApp = ({ Component, pageProps }: AppProps<{ dehydratedState?: any }>) => {
  return (
    <>
      <Providers dehydratedState={pageProps.dehydratedState}>
        {/* <TonConnector> */}
        <Header />

        <Component {...pageProps} />
        {/* </TonConnector> */}
      </Providers>
    </>
  )
}

export default MyApp
