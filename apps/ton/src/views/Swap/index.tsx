import { Box } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledBox = styled(Box)`
  opacity: 0.9;
  background-color: ${({ theme }) => theme.colors.primary};
`

export const TonSwapV2 = () => {
  return (
    <div>
      <h1>Swap</h1>
      <StyledBox>
        <p>Swap component</p>
      </StyledBox>
    </div>
  )
}
