import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Flex, FlexGap, MinusIcon, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { Collapse } from 'components/widgets/swap-v2/Collapse'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

const StyledButton = styled(Button).attrs({ variant: 'tertiary', scale: 'sm' })`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii['12px']};
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.primary60};
`

interface LiquidityRowProps {
  title: string
  currency0?: string
  currency1?: string
}

export const LiquidityRow = ({ title, currency0, currency1 }: LiquidityRowProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  return (
    <>
      <LightCard>
        <Collapse
          title={
            <FlexGap flexDirection="column" gap="2px">
              <Text>
                {currency0}-{currency1} LP
              </Text>
              <Text color="textSubtle" small bold>
                36.1
              </Text>
            </FlexGap>
          }
          content={
            <Box mt="8px">
              <Flex mt="5px" justifyContent="space-between">
                <Text color="textSubtle">{t('Pooled %symbol%', { symbol: currency0 })}</Text>
                <Text>10</Text>
              </Flex>
              <Flex mt="5px" justifyContent="space-between">
                <Text color="textSubtle">{t('Pooled %symbol%', { symbol: currency1 })}</Text>
                <Text>50</Text>
              </Flex>
              <Flex mt="5px" justifyContent="space-between">
                <Text color="textSubtle">{t('Your share in the pool')}</Text>
                <Text>0.0124%</Text>
              </Flex>
              <FlexGap mt="10px" justifyContent="space-between" gap="16px">
                <StyledButton endIcon={<AddIcon color="primary60" />}>{t('Add')}</StyledButton>
                <StyledButton endIcon={<MinusIcon color="primary60" />}>{t('Remove')}</StyledButton>
              </FlexGap>
            </Box>
          }
          isOpen={isOpen}
          onToggle={handleToggle}
        />
      </LightCard>
    </>
  )
}
