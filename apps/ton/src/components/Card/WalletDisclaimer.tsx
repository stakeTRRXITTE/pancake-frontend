import { FlexGap, FlexGapProps, Text } from '@pancakeswap/uikit'

interface ConnectWalletDisclaimerProps extends FlexGapProps {
  text?: string
  imgWidth?: number
}

export const WalletDisclaimer = ({ text, imgWidth, ...props }: ConnectWalletDisclaimerProps) => {
  return (
    <FlexGap flexDirection="column" alignItems="center" gap="16px" {...props}>
      {/* TODO: Move to assets */}
      <img src="/images/wallet.png" alt="wallet" width={imgWidth || 64} />
      <Text color="textSubtle">{text}</Text>
    </FlexGap>
  )
}
