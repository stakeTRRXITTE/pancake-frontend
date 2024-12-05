// import { TonConnectButton } from '@tonconnect/ui-react'

import { Flex, LogoIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 24px;
  align-items: center;
`

export const Header = () => {
  return (
    <StyledHeader>
      <Flex alignItems="center">
        <LogoIcon width={32} />

        <Flex ml="8px" alignItems="center">
          {/* TODO: Move TON logo to assets */}
          <img src="/images/ton-logo.png" alt="TON" width={32} height={32} />
          <Text ml="8px">TON</Text>
        </Flex>
      </Flex>
      {/* <TonConnectButton /> */}
    </StyledHeader>
  )
}
