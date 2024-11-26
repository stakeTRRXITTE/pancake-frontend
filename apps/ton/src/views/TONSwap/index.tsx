import { Box, Flex } from '@pancakeswap/uikit'

import { StyledSwapContainer } from 'components/widgets/Swap/styles'
import { V4SwapForm } from 'components/widgets/SwapSimplify/V4Swap'
import styled from 'styled-components'
import Page from 'views/Page'

const Wrapper = styled(Box)`
  border: 1px solid red;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 328px;
    max-width: 480px;
  }
`

export const TonSwapV2 = () => {
  return (
    <Page removePadding>
      <Flex width="100%" height="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column" alignItems="center" height="100%">
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
