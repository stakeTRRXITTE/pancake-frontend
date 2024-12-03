import { LanguageProvider } from '@pancakeswap/localization'
import { dark, light, ResetCSS, UIKitProvider } from '@pancakeswap/uikit'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useThemeCookie from 'hooks/useThemeCookie'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { PropsWithChildren } from 'react'
import GlobalStyle from 'styles/GlobalStyle'

const queryClient = new QueryClient()

function GlobalHooks() {
  useThemeCookie()

  return null
}

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()

  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

interface ProvidersProps extends PropsWithChildren {
  dehydratedState?: any
}
export const Providers = ({ children, dehydratedState }: ProvidersProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <JotaiProvider>
            <NextThemeProvider>
              <StyledUIKitProvider>
                <GlobalHooks />
                <ResetCSS />
                <GlobalStyle />
                <LanguageProvider>{children}</LanguageProvider>
              </StyledUIKitProvider>
            </NextThemeProvider>
          </JotaiProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  )
}