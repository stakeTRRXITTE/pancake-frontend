// import { TonConnectButton } from '@tonconnect/ui-react'

import { CogIcon, Flex, LogoIcon, ShareIcon, Text } from '@pancakeswap/uikit'
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
        <LogoIcon width={24} />

        <Flex ml="8px" alignItems="center">
          {/* TODO: Move TON logo to assets */}
          <img src="/images/ton-logo.png" alt="TON" width={24} />
          <Text ml="8px">TON</Text>
        </Flex>
      </Flex>

      <Flex alignItems="center">
        <CogIcon width={24} color="textSubtle" />
        <ShareIcon width={24} color="textSubtle" ml="16px" />
      </Flex>
      {/* <TonConnectButton /> */}
    </StyledHeader>
  )
}
