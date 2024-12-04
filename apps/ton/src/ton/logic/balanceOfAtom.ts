import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import isEqual from 'lodash/isEqual'
import { contractOfTypeAtom } from 'ton/atom/contractOfTypeAtom'
import { walletAddressAtom } from 'ton/atom/walletAddressAtom'
import { TonContractNames, TonContractTypes } from 'ton/ton.enums'
import { Maybe } from 'ton/utils/Maybe'
import { jettonWalletOfAtom } from './jettonWalletOfAtom'

export const balanceOfAtom = atomFamily((jetton: TonContractNames) => {
  return atom(async (get) => {
    const userAddress = get(walletAddressAtom)

    const jettonAddress = await get(
      jettonWalletOfAtom({
        contractName: jetton,
        ownerAddress: userAddress.unwrap(),
      }),
    )

    return jettonAddress.mapAsync(async (jettonAddr) => {
      const jettonContract = get(
        contractOfTypeAtom({
          type: TonContractTypes.Jetton,
          address: jettonAddr,
        }),
      )
      const balance = await jettonContract.get_balance()
      return balance
    })
  })
}, isEqual)
