import { Button } from '@pancakeswap/uikit'
import { SwapUIV2 } from 'components/widgets/swap-v2'
import { ButtonAndDetailsPanel } from './ButtonAndDetailsPanel'
import { FormMain } from './FormMainV4'

export function V4SwapForm() {
  // const {
  //   betterOrder,
  //   bestOrder,
  //   refreshOrder,
  //   tradeError,
  //   tradeLoaded,
  //   refreshDisabled,
  //   pauseQuoting,
  //   resumeQuoting,
  //   xOrder,
  //   ammOrder,
  // } = useAllTypeBestTrade()

  // const isWrapping = useIsWrapping()

  // const { data: inputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.inputAmount.currency)
  // const { data: outputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.outputAmount.currency)

  // const executionPrice = useMemo(
  //   () => (bestOrder?.trade ? SmartRouter.getExecutionPrice(bestOrder.trade) : undefined),
  //   [bestOrder?.trade],
  // )

  // const commitHooks = useMemo(() => {
  //   return {
  //     beforeCommit: () => {
  //       pauseQuoting()
  //       try {
  //         const validTrade = ammOrder?.trade ?? xOrder?.trade
  //         if (!validTrade) {
  //           throw new Error('No valid trade to log')
  //         }
  //         const { inputAmount, tradeType, outputAmount } = validTrade
  //         const { currency: inputCurrency } = inputAmount
  //         const { currency: outputCurrency } = outputAmount
  //         const { chainId } = inputCurrency
  //         const ammInputAmount = ammOrder?.trade?.inputAmount.toExact()
  //         const ammOutputAmount = ammOrder?.trade?.outputAmount.toExact()
  //         const xInputAmount = xOrder?.trade?.inputAmount.toExact()
  //         const xOutputAmount = xOrder?.trade?.outputAmount.toExact()
  //         logger.info('X/AMM Quote Comparison', {
  //           chainId,
  //           tradeType,
  //           inputNative: inputCurrency.isNative,
  //           outputNative: outputCurrency.isNative,
  //           inputToken: inputCurrency.wrapped.address,
  //           outputToken: outputCurrency.wrapped.address,
  //           bestOrderType: betterOrder?.type,
  //           ammOrder: {
  //             type: ammOrder?.type,
  //             inputAmount: ammInputAmount,
  //             outputAmount: ammOutputAmount,
  //             inputUsdValue: inputUsdPrice && ammInputAmount ? Number(ammInputAmount) * inputUsdPrice : undefined,
  //             outputUsdValue: outputUsdPrice && ammOutputAmount ? Number(ammOutputAmount) * outputUsdPrice : undefined,
  //           },
  //           xOrder: xOrder
  //             ? {
  //                 filler: xOrder.type === OrderType.DUTCH_LIMIT ? xOrder.trade.orderInfo.exclusiveFiller : undefined,
  //                 type: xOrder.type,
  //                 inputAmount: xInputAmount,
  //                 outputAmount: xOutputAmount,
  //                 inputUsdValue: inputUsdPrice && xInputAmount ? Number(xInputAmount) * inputUsdPrice : undefined,
  //                 outputUsdValue: outputUsdPrice && xOutputAmount ? Number(xOutputAmount) * outputUsdPrice : undefined,
  //               }
  //             : undefined,
  //         })
  //       } catch (error) {
  //         //
  //       }
  //     },
  //     afterCommit: resumeQuoting,
  //   }
  // }, [pauseQuoting, resumeQuoting, xOrder, ammOrder, inputUsdPrice, outputUsdPrice, betterOrder?.type])

  return (
    <SwapUIV2.SwapFormWrapper>
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        {/* <FormMain
          tradeLoading={!tradeLoaded}
          inputAmount={bestOrder?.trade?.inputAmount}
          outputAmount={bestOrder?.trade?.outputAmount}
          swapCommitButton={
            <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
          }
          isUserInsufficientBalance={isUserInsufficientBalance}
        /> */}
        <FormMain
          tradeLoading={false}
          inputAmount={undefined}
          outputAmount={undefined}
          isUserInsufficientBalance={false}
        />
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      <ButtonAndDetailsPanel
        swapCommitButton={
          <Button>Swap</Button>
          // <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
        }
        // pricingAndSlippage={
        //   <FlexGap
        //     alignItems="center"
        //     flexWrap="wrap"
        //     justifyContent="space-between"
        //     width="calc(100% - 20px)"
        //     gap="8px"
        //   >
        //     <FlexGap
        //       onClick={(e) => {
        //         e.stopPropagation()
        //       }}
        //       alignItems="center"
        //       flexWrap="wrap"
        //     >
        //       <RefreshButton
        //         onRefresh={refreshOrder}
        //         refreshDisabled={refreshDisabled}
        //         chainId={activeChainId}
        //         loading={!tradeLoaded}
        //       />
        //       <PricingAndSlippage
        //         priceLoading={!tradeLoaded}
        //         price={executionPrice ?? undefined}
        //         showSlippage={false}
        //       />
        //     </FlexGap>
        //     <TradingFee loaded={tradeLoaded} order={bestOrder} />
        //   </FlexGap>
        // }
        // tradeDetails={<TradeDetails loaded={tradeLoaded} order={bestOrder} />}
        // shouldRenderDetails={Boolean(executionPrice) && Boolean(bestOrder) && !isWrapping}
      />
    </SwapUIV2.SwapFormWrapper>
  )
}
