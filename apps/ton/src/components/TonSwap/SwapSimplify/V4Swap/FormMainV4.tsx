import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { ReactNode, useCallback } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import CurrencyInputPanelSimplify from 'components/TonSwap/CurrencyInputPanelSimplify'

import { swapStateAtom } from 'atoms/swapStateAtom'
import { useSwapActionHandlers } from 'hooks/swap/useSwapActionHandlers'
import { useAtomValue } from 'jotai'
import noop from 'lodash/noop'
import { Field } from 'types'
import { FlipButton } from './FlipButton'
import { FormContainer } from './FormContainer'

interface Props {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeLoading?: boolean
  pricingAndSlippage?: ReactNode
  isUserInsufficientBalance?: boolean
}

export function FormMain({ inputAmount, outputAmount, tradeLoading, isUserInsufficientBalance }: Props) {
  // const account = '0x00' // dummy account value
  const { t } = useTranslation()
  // const warningSwapHandler = useWarningImport()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useAtomValue(swapStateAtom)

  // const isWrapping = useIsWrapping()
  // const inputCurrency = useCurrency(inputCurrencyId)
  // const outputCurrency = useCurrency(outputCurrencyId)
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  // const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  // const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  // const loadedUrlParams = useDefaultsFromURLSearch()
  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  // const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  // const handlePercentInput = useCallback(
  //   (percent: number) => {
  //     if (maxAmountInput) {
  //       onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
  //     }
  //   },
  //   [maxAmountInput, onUserInput],
  // )

  // const handleMaxInput = useCallback(() => {
  //   if (maxAmountInput) {
  //     onUserInput(Field.INPUT, maxAmountInput.toExact())
  //   }
  // }, [maxAmountInput, onUserInput])

  // const handleCurrencySelect = useCallback(
  //   (
  //     newCurrency: Currency,
  //     field: Field,
  //     currentInputCurrencyId: string | undefined,
  //     currentOutputCurrencyId: string | undefined,
  //   ) => {
  //     onCurrencySelection(field, newCurrency)

  //     warningSwapHandler(newCurrency)

  //     const isInput = field === Field.INPUT
  //     const oldCurrencyId = isInput ? currentInputCurrencyId : currentOutputCurrencyId
  //     const otherCurrencyId = isInput ? currentOutputCurrencyId : currentInputCurrencyId
  //     const newCurrencyId = currencyId(newCurrency)
  //     replaceBrowserHistoryMultiple({
  //       ...(newCurrencyId === otherCurrencyId && { [isInput ? 'outputCurrency' : 'inputCurrency']: oldCurrencyId }),
  //       [isInput ? 'inputCurrency' : 'outputCurrency']: newCurrencyId,
  //     })
  //   },
  //   [onCurrencySelection, warningSwapHandler],
  // )
  // const handleInputSelect = useCallback(
  //   (newCurrency: Currency) =>
  //     handleCurrencySelect(newCurrency, Field.INPUT, inputCurrencyId || '', outputCurrencyId || ''),
  //   [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  // )
  // const handleOutputSelect = useCallback(
  //   (newCurrency: Currency) =>
  //     handleCurrencySelect(newCurrency, Field.OUTPUT, inputCurrencyId || '', outputCurrencyId || ''),
  //   [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  // )

  // const isTypingInput = independentField === Field.INPUT
  // const inputValue = useMemo(
  //   () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
  //   [typedValue, isTypingInput, inputAmount],
  // )
  // const outputValue = useMemo(
  //   () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
  //   [typedValue, isTypingInput, outputAmount],
  // )
  // const inputLoading = typedValue ? !isTypingInput && tradeLoading : false
  // const outputLoading = typedValue ? isTypingInput && tradeLoading : false

  return (
    <FormContainer>
      {/* <CurrencyInputPanelSimplify
        id="swap-currency-input"
        showUSDPrice
        showMaxButton
        showCommonBases
        inputLoading={!isWrapping && inputLoading}
        currencyLoading={!loadedUrlParams}
        label={!isTypingInput && !isWrapping ? t('From (estimated)') : t('From')}
        value={isWrapping ? typedValue : inputValue}
        maxAmount={maxAmountInput}
        showQuickInputButton
        currency={inputCurrency}
        onUserInput={handleTypeInput}
        onPercentInput={handlePercentInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={outputCurrency}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
        title={
          <Text color="textSubtle" fontSize={12} bold>
            {t('From')}
          </Text>
        }
        isUserInsufficientBalance={isUserInsufficientBalance}
      /> */}
      <CurrencyInputPanelSimplify
        id="swap-currency-input"
        showUSDPrice
        showMaxButton
        showCommonBases
        inputLoading={false}
        currencyLoading={false}
        label={t('From')}
        value={typedValue}
        maxAmount={undefined}
        showQuickInputButton
        currency={inputAmount?.currency}
        onUserInput={handleTypeInput}
        onPercentInput={noop}
        onMax={noop}
        onCurrencySelect={() => {
          console.log('On currency select for input')
        }}
        otherCurrency={outputAmount?.currency}
        commonBasesType={undefined}
        title={
          <Text color="textSubtle" fontSize={12} bold>
            {t('From')}
          </Text>
        }
        isUserInsufficientBalance={isUserInsufficientBalance}
      />
      <FlipButton />
      <CurrencyInputPanelSimplify
        id="swap-currency-input"
        showUSDPrice
        showMaxButton
        showCommonBases
        inputLoading={false}
        currencyLoading={false}
        label={t('From')}
        value="0"
        maxAmount={undefined}
        showQuickInputButton
        currency={outputAmount?.currency}
        onUserInput={noop}
        onPercentInput={noop}
        onMax={noop}
        onCurrencySelect={noop}
        otherCurrency={inputAmount?.currency}
        commonBasesType={undefined}
        title={
          <Text color="textSubtle" fontSize={12} bold>
            {t('To')}
          </Text>
        }
        isUserInsufficientBalance={isUserInsufficientBalance}
        disabled
      />
      {/* <CurrencyInputPanelSimplify
        id="swap-currency-output"
        showUSDPrice
        showCommonBases
        showMaxButton={false}
        inputLoading={!isWrapping && outputLoading}
        currencyLoading={!loadedUrlParams}
        label={isTypingInput && !isWrapping ? t('To (estimated)') : t('To')}
        value={isWrapping ? typedValue : outputValue}
        currency={outputCurrency}
        onUserInput={handleTypeOutput}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={inputCurrency}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
        title={
          <Text color="textSubtle" fontSize={12} bold>
            {t('To')}
          </Text>
        }
      /> */}
      {/* <AssignRecipientButton /> */}
      {/* <Recipient /> */}
    </FormContainer>
  )
}