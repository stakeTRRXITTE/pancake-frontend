import { Swap } from 'components/widgets'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
    showHelpLink?: boolean
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl,
  showHelpLink = true,
  ...props
}) => {
  return (
    <Swap.Page
      removePadding={removePadding}
      noMinHeight={noMinHeight}
      hideFooterOnDesktop={hideFooterOnDesktop}
      helpUrl={showHelpLink ? helpUrl : undefined}
      {...props}
    >
      {children}
    </Swap.Page>
  )
}

export default Page
