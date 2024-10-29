import { TradeType } from '@pancakeswap/sdk'
import { PoolType, RouteType, SmartRouter, SmartRouterTrade, getInputCurrency } from '@pancakeswap/smart-router'
import invariant from 'tiny-invariant'
import { CONTRACT_BALANCE } from '../../constants'
import { PancakeSwapOptions, SwapSection, SwapTradeContext } from '../types'

export const parseSwapTradeContext = (
  trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>,
  options: PancakeSwapOptions,
): SwapTradeContext => {
  const numberOfTrades = trade.routes.length
  const inputIsNative = trade.inputAmount.currency.isNative
  const outputIsNative = trade.outputAmount.currency.isNative
  const performAggregatedSlippageCheck = trade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
  const routerMustCustody = outputIsNative || !!options.fee || performAggregatedSlippageCheck

  const context: SwapTradeContext = {
    trade,
    options,
    routes: [],
    routerMustCustody,
    outputIsNative,
    inputIsNative,
    mergeWrap: false,
    hasV4: false,
  }

  // Divide the routes into sections based on the pool type
  // Same pool type sections can be aggregated into a single swap
  for (let k = 0; k < trade.routes.length; k++) {
    const route = trade.routes[k]
    const sections = SmartRouter.partitionMixedRouteByProtocol(route)

    const amountIn = SmartRouter.maximumAmountIn(trade, options.slippageTolerance, route.inputAmount).quotient
    const amountOut: bigint = SmartRouter.minimumAmountOut(
      trade,
      options.slippageTolerance,
      route.outputAmount,
    ).quotient
    let currentCurrency = trade.inputAmount.currency

    const routeContext = {
      sections: [] as SwapSection[],
    }
    context.routes.push(routeContext)

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      invariant(section.length, 'EMPTY_SECTION')
      const type = poolTypeToRouteType(section[0].type)

      invariant(
        type === RouteType.V2 ||
          type === RouteType.V3 ||
          type === RouteType.V4BIN ||
          type === RouteType.V4CL ||
          type === RouteType.STABLE,
        'INVALID_ROUTE_TYPE',
      )

      const currencyIn = getInputCurrency(section[0], currentCurrency)
      const currencyOut = SmartRouter.getOutputOfPools(section, currencyIn)
      const newRoute = SmartRouter.buildBaseRoute([...section], currencyIn, currencyOut)
      const isFirstSection = i === 0
      const isLastSection = i === sections.length - 1
      const inAmount = isFirstSection ? amountIn : CONTRACT_BALANCE
      const outAmount = isLastSection ? amountOut : 0n
      const wrap = currentCurrency.isNative && !currencyIn.isNative
      currentCurrency = currencyOut
      const nextInput = sections[i + 1]
        ? getInputCurrency(sections[i + 1][0], currencyOut)
        : route.outputAmount.currency
      const unwrap = !currentCurrency.isNative && nextInput.isNative

      const payerIsUser = !wrap && i === 0
      const isV4 = type === RouteType.V4BIN || type === RouteType.V4CL
      const payeeIsUser = isLastSection && !isV4 && !unwrap && !options.fee && !performAggregatedSlippageCheck
      const v4SettleBefore = isV4 && i > 0

      const swap: SwapSection = {
        type,
        inAmount,
        outAmount,
        route: newRoute,
        payerIsUser,
        payeeIsUser,
        currencyIn,
        currencyOut,
        beforeSwap: {
          wrap,
          v4Settle: v4SettleBefore,
        },
        afterSwap: {
          unwrap,
          v4Settle: isV4 && !v4SettleBefore,
          v4Take: isV4,
        },
        isStart: isFirstSection && k === 0,
        isLastOfRoute: isLastSection,
        isFinal: isLastSection && k === trade.routes.length - 1,
        isV4,
        isV2: type === RouteType.V2,
        nextSection: null,
        pools: section,
      }
      routeContext.sections.push(swap)
    }
  }

  /* Connect the sections */
  for (const route of context.routes) {
    for (let i = 0; i < route.sections.length; i++) {
      const section = route.sections[i]
      if (!section.isLastOfRoute) {
        section.nextSection = route.sections[i + 1]
      }
    }
  }

  /* Sometimes multiple route can merge wrap/unwrap operation */
  if (context.routes.length > 1) {
    context.mergeWrap = context.routes.map((x) => x.sections[0]).every((x) => x.beforeSwap.wrap)
  }

  /* Calc some flags */
  context.hasV4 = context.routes.some((x) => x.sections.some((y) => y.isV4))

  return context
}

function poolTypeToRouteType(poolType: PoolType): RouteType {
  switch (poolType) {
    case PoolType.V2:
      return RouteType.V2
    case PoolType.V3:
      return RouteType.V3
    case PoolType.STABLE:
      return RouteType.STABLE
    case PoolType.V4CL:
      return RouteType.V4CL
    case PoolType.V4BIN:
      return RouteType.V4BIN
    default:
      throw new Error('Invalid pool type')
  }
}
