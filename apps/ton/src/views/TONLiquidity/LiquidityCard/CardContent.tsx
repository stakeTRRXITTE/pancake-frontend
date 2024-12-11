import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, BoxProps, Button, FlexGap, Text } from '@pancakeswap/uikit'
import { WalletDisclaimer } from 'components/Card/WalletDisclaimer'
import styled from 'styled-components'
import { LiquidityList } from './LiquidityList'

const ContentContainer = styled(Box)<{ $isBottomRounded?: boolean }>`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme, $isBottomRounded }) =>
    $isBottomRounded ? `0 0 ${theme.radii.card} ${theme.radii.card}` : '0'};
`

const StyledCardFooter = styled(Box)`
  padding: 24px;

  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

interface CardContentProps extends BoxProps {}
export const CardContent = (props: CardContentProps) => {
  const { t } = useTranslation()
  const isWalletConnected = true
  const liquidityLength: number = 1

  return (
    <>
      <ContentContainer $isBottomRounded={!isWalletConnected} {...props}>
        {!isWalletConnected && <WalletDisclaimer my="8px" text={t('Connect wallet to view your liquidity')} />}

        {isWalletConnected && liquidityLength === 0 && (
          <FlexGap flexDirection="column" alignItems="center" gap="16px" my="8px">
            <img src="/images/green-box.png" alt="Empty Box" width={96} />

            <Text color="textSubtle">{t('No liquidity found')}</Text>
          </FlexGap>
        )}

        {isWalletConnected && liquidityLength > 0 && <LiquidityList />}
      </ContentContainer>

      {isWalletConnected && (
        <StyledCardFooter>
          <Button width="100%" endIcon={<AddIcon color="white" />}>
            Add Liquidity
          </Button>
        </StyledCardFooter>
      )}
    </>
  )
}
