import { useQuery } from '@tanstack/react-query'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { MAINNET_API_URL, TESTNET_API_URL } from '../constants'
import { Exchange } from '../exchange'
import { Info } from '../info'

interface SetupResult {
  address: string
  info: Info
  exchange: Exchange
}

export function useSetup(isMainnet: boolean = true, skipWs: boolean = false) {
  const { address } = useAccount()
  const baseUrl = isMainnet ? MAINNET_API_URL : TESTNET_API_URL

  const defaultResult: SetupResult = {
    address: zeroAddress,
    info: new Info(baseUrl, skipWs),
    exchange: new Exchange('', baseUrl),
  }

  const query = useQuery({
    queryKey: ['setup', address],
    queryFn: async () => {
      try {
        if (!address) {
          throw new Error('No wallet address found.')
        }

        const info = new Info(baseUrl, skipWs)
        const userState = await info.userState(address)
        const spotUserState = await info.spotUserState(address)

        const { marginSummary } = userState
        if (parseFloat(marginSummary.accountValue) === 0 && spotUserState.balances.length === 0) {
          console.error('Not running the example because the provided account has no equity.')
          const url = info.getBaseUrl().split('.', 2).join('.')
          const errorString = `No accountValue:\\nIf you think this is a mistake, make sure that ${address} has a balance on ${url}.\\nIf address shown is your API wallet address, update the config to specify the address of your account, not the address of the API wallet.`
          throw new Error(errorString)
        }

        const exchange = new Exchange('', baseUrl, undefined, address)

        return {
          address,
          info,
          exchange,
        }
      } catch (error) {
        console.error('Not running the example because the provided account has no equity.')
        return defaultResult
      }
    },
    enabled: Boolean(address),
  })

  if (!query.isFetched && !address) {
    return defaultResult
  }

  return query.data || defaultResult
}
