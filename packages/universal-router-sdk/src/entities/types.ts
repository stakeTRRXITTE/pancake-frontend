import { PermitSingle } from '@pancakeswap/permit2-sdk'
import { BigintIsh, Currency, TradeType } from '@pancakeswap/sdk'
import { BaseRoute, Pool, RouteType, SmartRouterTrade, SwapOptions } from '@pancakeswap/smart-router'
import { Address } from 'viem'

export interface Permit2Signature extends PermitSingle {
  signature: `0x${string}`
}

export type SwapRouterConfig = {
  sender?: Address // address
  deadline?: BigintIsh | undefined
}

export type FlatFeeOptions = {
  amount: BigintIsh
  recipient: Address
}

export type PancakeSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Signature
  flatFee?: FlatFeeOptions
}

export type SwapSection = {
  route: BaseRoute
  type: RouteType.V2 | RouteType.V3 | RouteType.V4BIN | RouteType.V4CL | RouteType.STABLE
  inAmount: bigint
  outAmount: bigint
  beforeSwap: {
    wrap: boolean // Should wrap the native input to wrapped-token.
    v4Settle: boolean // Should settle the input token from contract to vault.
  }
  afterSwap: {
    unwrap: boolean // Should unwrap the output token to native token
    v4Take: boolean // Should take the output token from vault to contract.
    v4Settle: boolean // Should settle the output token from vault to user.
  }
  payerIsUser: boolean
  payeeIsUser: boolean
  isLastOfRoute: boolean
  isStart: boolean
  isFinal: boolean
  isV4: boolean
  isV2: boolean
  currencyIn: Currency
  currencyOut: Currency
  nextSection: SwapSection | null
  pools: Pool[]
}

export type SwapTradeContext = {
  trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>
  options: PancakeSwapOptions
  routes: {
    sections: SwapSection[]
  }[]
  routerMustCustody: boolean
  outputIsNative: boolean
  inputIsNative: boolean
  mergeWrap: boolean
  hasV4: boolean
}
