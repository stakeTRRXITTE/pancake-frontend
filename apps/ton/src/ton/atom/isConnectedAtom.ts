import { atom } from 'jotai'
import { walletAddressAtom } from './walletAddressAtom'

export const isConnectedAtom = atom((get) => {
  return get(walletAddressAtom)
    .map((x) => Boolean(x))
    .unwrapOr(false)
})
