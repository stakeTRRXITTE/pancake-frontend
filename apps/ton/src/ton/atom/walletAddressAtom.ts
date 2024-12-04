import { atom } from 'jotai'
import { Maybe } from 'ton/utils/Maybe'

export const walletAddressAtom = atom<Maybe<string>>(Maybe.Nothing())
