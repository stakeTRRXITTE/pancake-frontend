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

export function floatToWire(value: number): string {
  return value.toFixed(8)
}

export function orderTypeToWire(orderType: OrderType): OrderTypeWire {
  if (orderType.limit) {
    return { limit: orderType.limit }
  }
  if (orderType.trigger) {
    return {
      trigger: {
        isMarket: orderType.trigger.isMarket,
        triggerPx: floatToWire(orderType.trigger.triggerPx),
        tpsl: orderType.trigger.tpsl,
      },
    }
  }
  throw new Error('Invalid order type')
}

export function orderRequestToOrderWire(order: OrderRequest, asset: number): Record<string, any> {
  return {
    a: asset,
    b: order.isBuy,
    p: floatToWire(order.limitPx),
    s: floatToWire(order.sz),
    r: order.reduceOnly,
    t: orderTypeToWire(order.orderType),
    c: order.cloid,
  }
}

export function orderWiresToOrderAction(
  orderWires: Array<Record<string, any>>,
  builder?: { b: string; f: number },
): Record<string, any> {
  return {
    type: 'batchOrder',
    orders: orderWires,
    builder,
  }
}

export function signL1Action(
  wallet: any,
  action: Record<string, any>,
  vault: string,
  timestamp: number,
  isMainnet: boolean,
): string {
  const payload = JSON.stringify({ action, timestamp, vault })
  return wallet.signMessage(payload, isMainnet)
}

export function signSpotTransferAction(
  toAddress: string,
  assetName: string,
  amount: number,
  timestamp: number,
): Record<string, any> {
  return {
    type: 'spotTransfer',
    toAddress,
    assetName,
    amount: floatToWire(amount),
    timestamp,
  }
}

export function signUsdTransferAction(toAddress: string, amount: number, timestamp: number): Record<string, any> {
  return {
    type: 'usdTransfer',
    toAddress,
    amount: floatToWire(amount),
    timestamp,
  }
}

export function signUsdClassTransferAction(
  toAddress: string,
  className: string,
  amount: number,
  timestamp: number,
): Record<string, any> {
  return {
    type: 'usdClassTransfer',
    toAddress,
    className,
    amount: floatToWire(amount),
    timestamp,
  }
}

export function signWithdrawFromBridgeAction(
  amount: number,
  toAddress: string,
  timestamp: number,
): Record<string, any> {
  return {
    type: 'withdrawFromBridge',
    amount: floatToWire(amount),
    toAddress,
    timestamp,
  }
}
