import { useTranslation } from '@pancakeswap/localization'
import { Link, Message, MessageText, Text } from '@pancakeswap/uikit'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useRouterQuery } from '../hooks/useRouterQuery'

const ONE_BILLION = 1_000_000_000
export const PoolTvlWarning = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  const { t } = useTranslation()
  const { id } = useRouterQuery()
  const tvlUsd = parseFloat(poolInfo.tvlUsd ?? '0')
  if (tvlUsd < ONE_BILLION) {
    return null
  }
  // const pairAddress = Pair.getAddress(token0.wrapped, token1.wrapped)
  const link = `https://pancakeswap.finance/info/v3/pairs/${id}`
  return (
    <Message my="24px" mx="24px" variant="warning">
      <MessageText fontSize="17px">
        <Text color="warning" as="span">
          {t('TVL and APR data may not be reflected correctly due to technical limitation, please refer to')}
          <Link
            href={link}
            external
            style={{
              display: 'inline',
              marginLeft: '4px',
              marginRight: '4px',
            }}
          >
            {t('this link')}
          </Link>
          {t('for accurate values')}
        </Text>
      </MessageText>
    </Message>
  )
}
