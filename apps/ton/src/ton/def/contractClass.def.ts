import { TonContractTypes } from 'ton/ton.enums'
import { getBalance, getWalletAddress } from './function.def'

export const ContractClasses = {
  [TonContractTypes.JettonMinter]: {
    interfaces: [getWalletAddress],
  },
  [TonContractTypes.Jetton]: {
    interfaces: [getBalance],
  },
  [TonContractTypes.PCSRouter]: {
    interfaces: [],
  },
} as const
