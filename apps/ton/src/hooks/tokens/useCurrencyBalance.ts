import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

export const useCurrencyBalance = (account: string, currency?: Currency) => {
  if (!currency) return undefined
  return CurrencyAmount.fromRawAmount(currency, 0)
}
