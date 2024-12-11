import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, SortArrowIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const FloatingBox = styled(Box)`
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Navigation = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 12px 32px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.invertedContrast};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    text-decoration: none;
  }
`

export const FloatingNavigation = () => {
  const { t } = useTranslation()
  return (
    <>
      <FloatingBox>
        <Navigation>
          <StyledLink href="/">
            <SortArrowIcon color="textSubtle" width={24} style={{ transform: 'rotate(90deg)' }} />
            <Text color="textSubtle" small>
              {t('Swap')}
            </Text>
          </StyledLink>
          <StyledLink href="/liquidity">
            <SortArrowIcon color="textSubtle" width={24} style={{ transform: 'rotate(90deg)' }} />
            <Text color="textSubtle" small>
              {t('Liquidity')}
            </Text>
          </StyledLink>
        </Navigation>
      </FloatingBox>
    </>
  )
}
