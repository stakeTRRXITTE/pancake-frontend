import { AtomBox, AtomBoxProps, SwapCSS } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean
  hideFooterOnDesktop?: boolean
  noMinHeight?: boolean
  helpUrl?: string
  helpImage?: ReactNode
  externalText?: string
  externalLinkUrl?: string
}

export const SwapPage = ({ removePadding, noMinHeight, children, ...props }: SwapPageProps) => (
  <AtomBox className={SwapCSS.pageVariants({ removePadding, noMinHeight })} {...props}>
    {children}
    <AtomBox display="flex" flexGrow={1} />
  </AtomBox>
)
