import { FlexGap, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { Collapse } from 'components/widgets/swap-v2/Collapse'

interface LiquidityRowProps {
  title: string
  currency0?: string
  currency1?: string
}

export const LiquidityRow = ({ title, currency0, currency1 }: LiquidityRowProps) => {
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
        />
      </LightCard>
    </>
  )
}
