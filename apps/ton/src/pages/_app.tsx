import { Header } from 'components/Header'
import type { AppProps } from 'next/app'
import { TonContextProvider } from 'ton/react/TonContextProvider'
import '../styles/globals.css' // Import global CSS

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <TonContextProvider>
      <>
        <Header />
        {/* Add a global layout or wrapper */}
        <Component {...pageProps} />
      </>
    </TonContextProvider>
  )
}

export default MyApp
