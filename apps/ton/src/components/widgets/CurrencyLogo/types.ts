import type { Address } from '@ton/core'

export type CurrencyInfo = {
  address?: Address
  symbol?: string
  chainId?: number
  isToken?: boolean
  isNative?: boolean
}
