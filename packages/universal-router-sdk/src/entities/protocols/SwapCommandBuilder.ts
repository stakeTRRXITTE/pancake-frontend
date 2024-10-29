import { CurrencyAmount, Percent, TradeType, validateAndParseAddress } from '@pancakeswap/sdk'
import {
  encodeV4RouteToPath,
  getPoolAddress,
  isV4ClPool,
  MSG_SENDER,
  RouteType,
  SmartRouter,
  StablePool,
  V4BinPool,
  V4ClPool,
} from '@pancakeswap/smart-router'
import {
  EncodedMultiSwapInParams,
  EncodedMultiSwapOutParams,
  EncodedMultiSwapParams,
  EncodedSingleSwapInParams,
  EncodedSingleSwapOutParams,
  EncodedSingleSwapParams,
} from '@pancakeswap/v4-sdk'
import { Address, parseEther, zeroAddress } from 'viem'
import { ADDRESS_THIS } from '../../constants'
import { CommandType, V4ActionType } from '../../router.types'
import { ABIParametersType } from '../../utils/createCommand'
import { currencyAddressV4 } from '../../utils/currencyAddressV4'
import { encodePoolKey } from '../../utils/encodePoolKey'
import { encodeFeeBips } from '../../utils/numbers'
import { RoutePlanner } from '../../utils/RoutePlanner'
import { SwapSection, SwapTradeContext } from '../types'

/* eslint-disable no-useless-constructor */
export class SwapCommandBuilder {
  constructor(private planner: RoutePlanner, private context: SwapTradeContext, private section: SwapSection) {}

  private tradeType() {
    return this.context.trade.tradeType
  }

  private getRoute() {
    return this.section.route
  }

  private isSingleHop(): boolean {
    return this.section.route.pools.length === 1
  }

  private maxAmountIn() {
    return this.section.inAmount
  }

  private minAmountOut() {
    return this.section.outAmount
  }

  private addV4SingleSwapParams() {
    const planer = new RoutePlanner()
    const pool = this.getRoute().pools[0] as V4BinPool | V4ClPool
    const poolKey = encodePoolKey(pool)
    const tradeType = this.tradeType()

    const baseParams: EncodedSingleSwapParams = {
      poolKey,
      zeroForOne: tradeType === TradeType.EXACT_INPUT,
      hookData: zeroAddress,
    }
    if (isV4ClPool(pool)) {
      baseParams.sqrtPriceLimitX96 = pool.sqrtRatioX96
    }

    if (tradeType === TradeType.EXACT_INPUT) {
      const params: EncodedSingleSwapInParams = {
        ...baseParams,
        amountIn: this.maxAmountIn(),
        amountOutMinimum: this.minAmountOut(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN_SINGLE, [params])
    } else {
      const params: EncodedSingleSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut(),
        amountInMaximum: this.maxAmountIn(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT_SINGLE, [params])
    }

    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  private addV4MultiSwapParams() {
    const planer = new RoutePlanner()
    const route = this.getRoute()
    const tradeType = this.tradeType()
    const baseParams: EncodedMultiSwapParams = {
      currencyIn: currencyAddressV4(route.input),
      path: encodeV4RouteToPath(route, tradeType === TradeType.EXACT_OUTPUT),
    }
    if (tradeType === TradeType.EXACT_INPUT) {
      const params: EncodedMultiSwapInParams = {
        ...baseParams,
        amountIn: this.maxAmountIn(),
        amountOutMinimum: this.minAmountOut(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_IN, [params])
    } else {
      const params: EncodedMultiSwapOutParams = {
        ...baseParams,
        amountOut: this.minAmountOut(),
        amountInMaximum: this.maxAmountIn(),
      }
      planer.addAction(V4ActionType.CL_SWAP_EXACT_OUT, [params])
    }
    this.planner.addSubPlan(CommandType.V4_SWAP, planer)
  }

  private addV4SwapCommand() {
    if (this.isSingleHop()) {
      this.addV4SingleSwapParams()
    } else {
      this.addV4MultiSwapParams()
    }
  }

  private wrapInput(): void {
    if (this.context.mergeWrap) {
      if (this.section.isStart) {
        this.planner.addCommand(CommandType.WRAP_ETH, [ADDRESS_THIS, this.section.inAmount])
      }
    } else if (this.section.beforeSwap.wrap) {
      this.planner.addCommand(CommandType.WRAP_ETH, [ADDRESS_THIS, this.section.inAmount])
    }
  }

  private settleBefore() {
    // Fund from contract to vault
    if (this.section.beforeSwap.v4Settle) {
      const planer = new RoutePlanner()
      const inAddress = currencyAddressV4(this.section.currencyIn)
      planer.addAction(V4ActionType.SETTLE, [inAddress, this.section.inAmount, false])
      this.planner.addSubPlan(CommandType.V4_SWAP, planer)
    }
  }

  private settleAfter() {
    if (this.section.afterSwap.v4Settle) {
      const planer = new RoutePlanner()
      const { currencyOut } = this.section
      // 1 ether just means a large amount
      planer.addAction(V4ActionType.SETTLE_ALL, [currencyAddressV4(currencyOut), parseEther('1')])
      this.planner.addSubPlan(CommandType.V4_SWAP, planer)
    }
  }

  private takeAfter() {
    if (this.section.afterSwap.v4Take) {
      const planer = new RoutePlanner()
      const { currencyOut, payeeIsUser } = this.section
      const recipient = payeeIsUser
        ? validateAndParseAddress(this.context.options.recipient ?? MSG_SENDER)
        : ADDRESS_THIS

      planer.addAction(V4ActionType.TAKE, [currencyAddressV4(currencyOut), recipient, this.section.outAmount])
    }
  }

  private beforeSwap() {
    this.wrapInput()
    this.settleBefore()
  }

  private payPortion() {
    const { fee, flatFee } = this.context.options
    const type = this.context.trade.tradeType

    if (this.section.isFinal && fee) {
      let minAmountOut = CurrencyAmount.fromRawAmount(this.section.currencyOut, this.section.outAmount)
      const feeBips = BigInt(encodeFeeBips(fee.fee))
      if (!this.section.isV4) {
        const { currencyOut } = this.section
        this.planner.addCommand(CommandType.PAY_PORTION, [currencyOut.wrapped.address, fee.recipient, feeBips])
      }

      // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
      // Otherwise we continue as expected with the trade's normal expected output
      if (type === TradeType.EXACT_OUTPUT) {
        minAmountOut = minAmountOut.subtract(minAmountOut.multiply(feeBips).divide(10000))
      }

      // TODO: missing flatFee
      if (flatFee) {
        const _fee = BigInt(flatFee.amount.toString())
        if (_fee < minAmountOut.quotient) throw new Error("Flat fee can't be greater than minimum amount out")

        this.planner.addCommand(CommandType.TRANSFER, [
          this.section.currencyOut.wrapped.address,
          flatFee.recipient,
          _fee,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (type === TradeType.EXACT_OUTPUT) {
          minAmountOut = CurrencyAmount.fromRawAmount(this.section.currencyOut, minAmountOut.quotient - _fee)
        }
      }
      this.section.outAmount = minAmountOut.quotient
    }
  }

  private sweepAfter() {
    if (!this.section.isV4 && this.section.isFinal && !this.section.afterSwap.unwrap) {
      if (!this.section.payeeIsUser) {
        const recipient = this.context.options.recipient || MSG_SENDER
        const outAmount = SmartRouter.minimumAmountOut(
          this.context.trade,
          this.context.options.slippageTolerance,
        ).quotient
        this.planner.addCommand(CommandType.SWEEP, [this.section.currencyOut.wrapped.address, recipient, outAmount])
      }
    }
  }

  private afterSwap() {
    this.payPortion()
    this.unwrapOutput()
    this.settleAfter()
    this.takeAfter()
    this.sweepAfter()
    this.unwrapInputForExactOutput()
  }

  private unwrapOutput() {
    if (this.section.afterSwap.unwrap) {
      const { outAmount } = this.section
      let recipient: Address = ADDRESS_THIS
      if (this.section.isLastOfRoute) {
        recipient = this.context.options.recipient || MSG_SENDER
      }
      this.planner.addCommand(CommandType.UNWRAP_WETH, [recipient, outAmount])
    }
  }

  private unwrapInputForExactOutput() {
    const { tradeType } = this.context.trade
    if (!this.section.isV4 && tradeType === TradeType.EXACT_OUTPUT && this.section.isLastOfRoute) {
      // If the trade is exact output, in V2,V3 there is a chance of partial fill
      // So we should unwrap the input token left
      const recipient = this.context.options.recipient || MSG_SENDER
      if (this.section.beforeSwap.wrap) {
        this.planner.addCommand(CommandType.UNWRAP_WETH, [recipient, 0n])
      }
    }
  }

  private getSwapRecipient(): Address {
    const recipient = this.section.payeeIsUser
      ? validateAndParseAddress(this.context.options.recipient ?? MSG_SENDER)
      : ADDRESS_THIS

    if (this.section.nextSection && this.section.nextSection.isV2) {
      const address = getPoolAddress(this.section.nextSection.pools[0])
      if (!address) throw new Error('unknown v2 pool address')
      return address
    }
    return recipient
  }

  private addV2SwapCommand(): void {
    const route = this.getRoute()
    const path = route.path.map((token) => token.wrapped.address)
    const { inAmount, outAmount, payerIsUser } = this.section
    const { tradeType } = this.context.trade

    const recipient = this.getSwapRecipient()
    if (tradeType === TradeType.EXACT_INPUT) {
      this.planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [recipient, inAmount, outAmount, path, payerIsUser])
      return
    }
    this.planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [recipient, outAmount, inAmount, path, payerIsUser])
  }

  private addV3SwapCommand() {
    const { route, inAmount, outAmount, payerIsUser } = this.section
    // we need to generaate v3 path as a hash string. we can still use encodeMixedRoute
    // as a v3 swap is essentially a for of mixedRoute
    const { tradeType } = this.context.trade
    const path = SmartRouter.encodeMixedRouteToPath(
      { ...route, input: route.input, output: route.output },
      tradeType === TradeType.EXACT_OUTPUT,
    )
    const recipient = this.getSwapRecipient()

    if (tradeType === TradeType.EXACT_INPUT) {
      const exactInputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_IN> = [
        recipient,
        inAmount,
        outAmount,
        path,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.V3_SWAP_EXACT_IN, exactInputSingleParams)
    } else {
      const exactOutputSingleParams: ABIParametersType<CommandType.V3_SWAP_EXACT_OUT> = [
        recipient,
        outAmount,
        inAmount,
        path,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, exactOutputSingleParams)
    }
  }

  private addStableSwap(): void {
    const { route, inAmount, outAmount, payerIsUser } = this.section
    const path = route.path.map((token) => token.wrapped.address)
    const flags = route.pools.map((p) => BigInt((p as StablePool).balances.length))
    const { tradeType } = this.context.trade
    const recipient = this.getSwapRecipient()

    if (tradeType === TradeType.EXACT_INPUT) {
      const exactInputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_IN> = [
        recipient,
        inAmount,
        outAmount,
        path,
        flags,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.STABLE_SWAP_EXACT_IN, exactInputParams)
    } else {
      const exactOutputParams: ABIParametersType<CommandType.STABLE_SWAP_EXACT_OUT> = [
        recipient,
        outAmount,
        inAmount,
        path,
        flags,
        payerIsUser,
      ]
      this.planner.addCommand(CommandType.STABLE_SWAP_EXACT_OUT, exactOutputParams)
    }
  }

  public build() {
    this.beforeSwap()

    switch (this.section.type) {
      case RouteType.V2:
        this.addV2SwapCommand()
        break
      case RouteType.V3:
        this.addV3SwapCommand()
        break
      case RouteType.STABLE:
        this.addStableSwap()
        break
      case RouteType.V4CL:
      case RouteType.V4BIN:
        this.addV4SwapCommand()
        break
      default:
        throw new Error('Invalid route type')
    }
    this.afterSwap()

    // if (this.section.isFinal) {
    //   this.afterTrade()
    // }
  }
}

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(50, 100)

// if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
// function riskOfPartialFill(trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>): boolean {
//   return SmartRouter.getPriceImpact(trade).greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
// }
