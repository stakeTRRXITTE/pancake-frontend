import { Box, Flex } from '@pancakeswap/uikit'
import { Header } from 'components/Header'
import { CenteredContainer } from 'components/styles'
import styled from 'styled-components'
import Page from 'views/Page'
import { LiquidityCard } from './LiquidityCard'

const Wrapper = styled(Box)`
  height: 100%;
  width: 100%;
  min-height: 100vh;

  margin: 24px 0;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 24px auto;
    width: 100%;
    min-width: 480px;
    max-width: ${({ theme }) => theme.siteWidth}px;
  }
`

export const TONLiquidity = () => {
  return (
    <Page removePadding>
      <Box width="100%">
        <Header showBridgeLink />
      </Box>
      <Flex width="100%" height="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column" alignItems="center" height="100%" width="100%">
          <CenteredContainer $isChartExpanded={false}>
            <Wrapper>
              <LiquidityCard />
            </Wrapper>
          </CenteredContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
