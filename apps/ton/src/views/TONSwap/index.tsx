import { Box, Flex } from '@pancakeswap/uikit'

import { StyledSwapContainer } from 'components/TonSwap/Swap/styles'
import { V4SwapForm } from 'components/TonSwap/SwapSimplify/V4Swap'
import styled from 'styled-components'
import Page from 'views/Page'

const Wrapper = styled(Box)`
  margin-top: 24px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
    min-width: 480px;
    max-width: ${({ theme }) => theme.siteWidth}px;
  }
`

export const TonSwapV2 = () => {
  return (
    <Page removePadding>
      <Flex width="100%" height="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column" alignItems="center" height="100%" width="100%">
          <StyledSwapContainer justifyContent="center" width="100%" style={{ height: '100%' }} $isChartExpanded={false}>
            <Wrapper height="100%">
              <V4SwapForm />
            </Wrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
