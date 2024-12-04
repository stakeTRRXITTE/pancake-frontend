import type { TonFunctionDef } from 'ton/ton.types'

export const getWalletAddress = {
  method: 'get_wallet_address',
  inputs: [
    {
      name: 'owner',
      type: 'address',
    },
  ],
  outputs: [
    {
      type: 'address',
    },
  ],
} as const satisfies TonFunctionDef

export const getBalance = {
  method: 'get_balance',
  inputs: [],
  outputs: [
    {
      type: 'int',
    },
  ],
} as const satisfies TonFunctionDef
