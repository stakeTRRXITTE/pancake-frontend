import { LanguageProvider } from '@pancakeswap/localization'
import { dark, light, UIKitProvider } from '@pancakeswap/uikit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { PropsWithChildren } from 'react'

const queryClient = new QueryClient()

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextThemeProvider>
          <StyledUIKitProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </StyledUIKitProvider>
        </NextThemeProvider>
      </QueryClientProvider>
    </>
  )
}
