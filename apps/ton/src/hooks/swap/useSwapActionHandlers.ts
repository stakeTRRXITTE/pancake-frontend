import { swapStateAtom } from 'atoms/swapStateAtom'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { Field } from 'types'

export const useSwapActionHandlers = () => {
  const setSwapState = useSetAtom(swapStateAtom)

  // WIP
  const onCurrencySelection = useCallback(
    (field: Field, currency: any) => {
      setSwapState((prev) => {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            currencyId: currency.id,
          },
        }
      })
    },
    [setSwapState],
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSwapState((prev) => {
        return {
          ...prev,
          typedValue,
          [field]: {
            ...prev[field],
            typedValue,
          },
        }
      })
    },
    [setSwapState],
  )

  return {
    onCurrencySelection,
    onUserInput,
  }
}
