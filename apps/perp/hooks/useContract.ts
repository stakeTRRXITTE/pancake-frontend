import { ChainId } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Abi, Address, erc20Abi } from 'viem'
import { useWalletClient } from 'wagmi'

import { multicallABI } from 'config/abi/Multicall'
import { useMemo } from 'react'
import { getMulticallAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/contractHelpers'

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address?: Address, options?: UseContractOptions) => {
  return useContract(address, erc20Abi, options)
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Abi)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract((chainId && (CAKE as any)?.[chainId]?.address) ?? CAKE[ChainId.BSC].address, erc20Abi)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}
