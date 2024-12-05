import { atom } from 'jotai'
import { Field, SwapState } from 'types'

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  pairDataById: {},
  derivedPairDataById: {},
  recipient: null,
}

export const swapStateAtom = atom<SwapState>(initialState)
