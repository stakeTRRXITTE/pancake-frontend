import { Token } from '@pancakeswap/sdk'

export const useNativeCurrency = () => {
  return new Token(1, '0x00', 18, 'TON', 'TON') // dummy value
}
