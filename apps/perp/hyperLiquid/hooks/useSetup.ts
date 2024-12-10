import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { MAINNET_API_URL, TESTNET_API_URL } from '../constants'
import { Exchange } from '../exchange'
import { Info } from '../info'

export function useSetup(isMainnet: boolean = true, skipWs: boolean = false) {
  const { address: walletAddress } = useAccount()

  const query = useQuery({
    queryKey: ['setup', walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('No wallet address found.')
      }

      const baseUrl = isMainnet ? MAINNET_API_URL : TESTNET_API_URL
      const info = new Info(baseUrl, skipWs)
      const userState = await info.userState(walletAddress)
      const spotUserState = await info.spotUserState(walletAddress)

      const { marginSummary } = userState
      if (parseFloat(marginSummary.accountValue) === 0 && spotUserState.balances.length === 0) {
        console.error('Not running the example because the provided account has no equity.')
        const url = info.getBaseUrl().split('.', 2).join('.')
        const errorString = `No accountValue:\\nIf you think this is a mistake, make sure that ${walletAddress} has a balance on ${url}.\\nIf address shown is your API wallet address, update the config to specify the address of your account, not the address of the API wallet.`
        throw new Error(errorString)
      }

      const exchange = new Exchange('', baseUrl, undefined, walletAddress)
      return { address: walletAddress, info, exchange }
    },
    enabled: Boolean(walletAddress),
  })

  return query
}
