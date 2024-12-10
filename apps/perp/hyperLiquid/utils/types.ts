export type Any = any
export type Optional<T> = T | null

export interface AssetInfo {
  name: string
  szDecimals: number
}

export interface Meta {
  universe: Array<AssetInfo>
}

export type Side = 'A' | 'B'

export interface SpotAssetInfo {
  name: string
  tokens: Array<number>
  index: number
  isCanonical: boolean
}

export interface SpotTokenInfo {
  name: string
  szDecimals: number
  weiDecimals: number
  index: number
  tokenId: string
  isCanonical: boolean
  evmContract?: string
  fullName?: string
}

export interface SpotMeta {
  universe: Array<SpotAssetInfo>
  tokens: Array<SpotTokenInfo>
}

export class Cloid {
  private rawCloid: string

  constructor(rawCloid: string) {
    this.rawCloid = rawCloid
    this.validate()
  }

  private validate() {
    if (!this.rawCloid.startsWith('0x') || this.rawCloid.length !== 34) {
      throw new Error('Invalid Cloid')
    }
  }

  static fromInt(cloid: number): Cloid {
    return new Cloid(`0x${cloid.toString(16).padStart(32, '0')}`)
  }

  static fromStr(cloid: string): Cloid {
    return new Cloid(cloid)
  }

  toRaw(): string {
    return this.rawCloid
  }
}

export type Subscription =
  | { type: 'allMids' }
  | { type: 'l2Book'; coin: string }
  | { type: 'trades'; coin: string }
  | { type: 'userEvents'; user: string }
  | { type: 'userFills'; user: string }
  | { type: 'candle'; coin: string; interval: string }
  | { type: 'orderUpdates'; user: string }
  | { type: 'userFundings'; user: string }
  | { type: 'userNonFundingLedgerUpdates'; user: string }

export type WsMsg =
  | { channel: 'allMids'; data: Record<string, string> }
  | { channel: 'l2Book'; data: { coin: string; levels: Array<{ px: string; sz: string; n: number }>; time: number } }
  | { channel: 'trades'; data: Array<{ coin: string; side: Side; px: string; sz: number; time: number }> }
  | { channel: 'user'; data: { fills: Array<{ coin: string; px: string; sz: string; time: number }> } }
  | {
      channel: 'userFills'
      data: { user: string; fills: Array<{ coin: string; px: string; sz: string; time: number }> }
    }
  | {
      channel: 'candle'
      data: { s: string; i: string; o: string; h: string; l: string; c: string; t: number; v: string }
    }
  | { channel: 'orderUpdates'; data: any }
  | { channel: 'userFundings'; data: any }
  | { channel: 'userNonFundingLedgerUpdates'; data: any }
  | { channel: 'pong' }

export type Tif = 'Alo' | 'Ioc' | 'Gtc'
export type Tpsl = 'tp' | 'sl'

export interface LimitOrderType {
  tif: Tif
}

export interface TriggerOrderType {
  triggerPx: number
  isMarket: boolean
  tpsl: Tpsl
}

export interface TriggerOrderTypeWire {
  triggerPx: string
  isMarket: boolean
  tpsl: Tpsl
}

export type OrderType = {
  limit?: LimitOrderType
  trigger?: TriggerOrderType
}

export type OrderTypeWire = {
  limit?: LimitOrderType
  trigger?: TriggerOrderTypeWire
}

export interface OrderRequest {
  coin: string
  isBuy: boolean
  sz: number
  limitPx: number
  orderType: OrderType
  reduceOnly: boolean
  cloid?: string
}

export type OidOrCloid = number | string

export interface ModifyRequest {
  oid: OidOrCloid
  order: OrderRequest
}

export interface CancelRequest {
  coin: string
  oid: number
}

export interface CancelByCloidRequest {
  coin: string
  cloid: string
}

export interface BuilderInfo {
  b: string
  f: number
}
