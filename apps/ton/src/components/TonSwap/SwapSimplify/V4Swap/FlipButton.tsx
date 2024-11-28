import { AutoColumn } from '@pancakeswap/uikit'

import { memo } from 'react'

import { AutoRow } from 'components/Layout/Row'
// import { useSwapState } from 'state/swap/hooks'
import { styled } from 'styled-components'

import { SwapUIV2 } from 'components/widgets/swap-v2'

export const Line = styled.div`
  position: absolute;
  left: -16px;
  right: -16px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  top: calc(50% + 6px);
`

export const FlipButton = memo(function FlipButton() {
  // const lottieRef = useRef<LottieRefCurrentProps | null>(null)

  // const { onSwitchTokens } = useSwapActionHandlers()
  // const {
  //   [Field.INPUT]: { currencyId: inputCurrencyId },
  //   [Field.OUTPUT]: { currencyId: outputCurrencyId },
  // } = useSwapState()

  // const onFlip = useCallback(() => {
  //   onSwitchTokens()
  //   replaceBrowserHistoryMultiple({
  //     inputCurrency: outputCurrencyId,
  //     outputCurrency: inputCurrencyId,
  //   })
  // }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])

  return (
    <AutoColumn justify="space-between" position="relative">
      <Line />
      <AutoRow justify="center" style={{ padding: '0 1rem', marginTop: '1em' }}>
        {/* <SwapUIV2.SwitchButtonV2 onClick={onFlip} /> */}
        <SwapUIV2.SwitchButtonV2 onClick={undefined} />

        {/* <Lottie
          lottieRef={lottieRef}
          animationData={ArrowLottie}
          style={{ height: '78px', cursor: 'pointer' }}
          onClick={onFlip}
          autoplay={false}
          loop={false}
          onMouseEnter={() => lottieRef.current?.playSegments([19, 32], true)}
          onMouseLeave={() => lottieRef.current?.playSegments([52, 73], true)}
        /> */}
      </AutoRow>
    </AutoColumn>
  )
})
