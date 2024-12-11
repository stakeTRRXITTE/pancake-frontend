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

export interface OrderType {
  limit?: LimitOrderType
  trigger?: TriggerOrderType
}

export interface OrderTypeWire {
  limit?: LimitOrderType
  trigger?: TriggerOrderTypeWire
}

export interface OrderRequest {
  coin: string
  is_buy: boolean
  sz: number
  limit_px: number
  order_type: OrderType
  reduce_only: boolean
  cloid?: string | null
}

export interface OrderWire {
  a: number
  b: boolean
  p: string
  s: string
  r: boolean
  t: OrderTypeWire
  c?: string | null
}

export interface ModifyRequest {
  oid: number | string
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

export type USD_SIGN_TYPES = Array<{ name: string; type: string }>

export interface Action {
  type: string
  orders?: OrderWire[]
  grouping?: string
  builder?: string
}

export function floatToWire(x: number): string {
  const rounded = x.toFixed(8)
  if (Math.abs(parseFloat(rounded) - x) >= 1e-12) {
    throw new Error(`floatToWire causes rounding: ${x}`)
  }
  const normalized = parseFloat(rounded).toString()
  return normalized === '-0' ? '0' : normalized
}

export function floatToInt(x: number, power: number): number {
  // eslint-disable-next-line no-restricted-properties
  const withDecimals = x * Math.pow(10, power)
  if (Math.abs(Math.round(withDecimals) - withDecimals) >= 1e-3) {
    throw new Error(`floatToInt causes rounding: ${x}`)
  }
  return Math.round(withDecimals)
}

export function floatToIntForHashing(x: number): number {
  return floatToInt(x, 8)
}

export function floatToUsdInt(x: number): number {
  return floatToInt(x, 6)
}

export function addressToBytes(address: string): Uint8Array {
  return new Uint8Array(Buffer.from(address.startsWith('0x') ? address.slice(2) : address, 'hex'))
}

export async function actionHash(action: object, vaultAddress: string | null, nonce: number): Promise<string> {
  const encoder = new TextEncoder()
  let data = encoder.encode(JSON.stringify(action) + nonce.toString())

  if (vaultAddress === null) {
    data = new Uint8Array([...data, 0])
  } else {
    const addressBytes = addressToBytes(vaultAddress)
    data = new Uint8Array([...data, 1, ...addressBytes])
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
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

export function orderRequestToOrderWire(order: OrderRequest, asset: number): OrderWire {
  const orderWire: OrderWire = {
    a: asset,
    b: order.is_buy,
    p: floatToWire(order.limit_px),
    s: floatToWire(order.sz),
    r: order.reduce_only,
    t: orderTypeToWire(order.order_type),
  }

  if (order.cloid) {
    orderWire.c = order.cloid
  }

  return orderWire
}

export function orderWiresToOrderAction(orderWires: OrderWire[], builder?: string): Action {
  const action: Action = {
    type: 'order',
    orders: orderWires,
    grouping: 'na',
  }
  if (builder) {
    action.builder = builder
  }
  return action
}

export function constructPhantomAgent(hash: string, isMainnet: boolean): object {
  return {
    source: isMainnet ? 'a' : 'b',
    connectionId: hash,
  }
}

export async function signL1Action(
  wallet: any,
  action: object,
  activePool: string | null,
  nonce: number,
  isMainnet: boolean,
): Promise<object> {
  const hash = await actionHash(action, activePool, nonce)
  const phantomAgent = constructPhantomAgent(hash, isMainnet)
  const data = {
    domain: {
      chainId: 1337,
      name: 'Exchange',
      verifyingContract: '0x0000000000000000000000000000000000000000',
      version: '1',
    },
    types: {
      Agent: [
        { name: 'source', type: 'string' },
        { name: 'connectionId', type: 'bytes32' },
      ],
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
    },
    primaryType: 'Agent',
    message: phantomAgent,
  }
  return signInner(wallet, data)
}

export function signUserSignedAction(
  wallet: any,
  action: object,
  payloadTypes: USD_SIGN_TYPES,
  primaryType: string,
  isMainnet: boolean,
): object {
  const updatedAction = {
    ...action,
    signatureChainId: '0x66eee',
    hyperliquidChain: isMainnet ? 'Mainnet' : 'Testnet',
  }

  const data = {
    domain: {
      name: 'HyperliquidSignTransaction',
      version: '1',
      chainId: 421614,
      verifyingContract: '0x0000000000000000000000000000000000000000',
    },
    types: {
      [primaryType]: payloadTypes,
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
    },
    primaryType,
    message: updatedAction,
  }

  return signInner(wallet, data)
}

export async function signInner(wallet: any, data: object): Promise<object> {
  const message = JSON.stringify(data)
  const encodedMessage = new TextEncoder().encode(message)
  const signature = await wallet.signMessage(encodedMessage)
  const r = signature.slice(0, 32)
  const s = signature.slice(32, 64)
  const v = parseInt(signature.slice(64), 16)

  return { r, s, v }
}

export function signMultiSigInner(
  wallet: any,
  action: object,
  isMainnet: boolean,
  signTypes: USD_SIGN_TYPES,
  txType: string,
  payloadMultiSigUser: string,
  outerSigner: string,
): object {
  const envelope = addMultiSigFields(action, payloadMultiSigUser, outerSigner)
  const enrichedSignTypes = addMultiSigTypes(signTypes)
  return signUserSignedAction(wallet, envelope, enrichedSignTypes, txType, isMainnet)
}

export function addMultiSigFields(action: object, payloadMultiSigUser: string, outerSigner: string): object {
  return {
    ...action,
    payloadMultiSigUser: payloadMultiSigUser.toLowerCase(),
    outerSigner: outerSigner.toLowerCase(),
  }
}

export function addMultiSigTypes(signTypes: USD_SIGN_TYPES): USD_SIGN_TYPES {
  const enrichedSignTypes = [...signTypes]
  const hasHyperliquidChain = signTypes.some((type) => type.name === 'hyperliquidChain')
  if (hasHyperliquidChain) {
    enrichedSignTypes.push({ name: 'payloadMultiSigUser', type: 'address' }, { name: 'outerSigner', type: 'address' })
  } else {
    console.warn('hyperliquidChain missing from signTypes.')
  }
  return enrichedSignTypes
}

export function signUsdTransferAction(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'destination', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'time', type: 'uint64' },
    ],
    'HyperliquidTransaction:UsdSend',
    isMainnet,
  )
}

export function signSpotTransferAction(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'destination', type: 'string' },
      { name: 'token', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'time', type: 'uint64' },
    ],
    'HyperliquidTransaction:SpotSend',
    isMainnet,
  )
}

export function signWithdrawFromBridgeAction(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'destination', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'time', type: 'uint64' },
    ],
    'HyperliquidTransaction:Withdraw',
    isMainnet,
  )
}

export function signUsdClassTransferAction(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'toPerp', type: 'bool' },
      { name: 'nonce', type: 'uint64' },
    ],
    'HyperliquidTransaction:UsdClassTransfer',
    isMainnet,
  )
}

export function signConvertToMultiSigUserAction(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'signers', type: 'string' },
      { name: 'nonce', type: 'uint64' },
    ],
    'HyperliquidTransaction:ConvertToMultiSigUser',
    isMainnet,
  )
}

export function signAgent(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'agentAddress', type: 'address' },
      { name: 'agentName', type: 'string' },
      { name: 'nonce', type: 'uint64' },
    ],
    'HyperliquidTransaction:ApproveAgent',
    isMainnet,
  )
}

export function signApproveBuilderFee(wallet: any, action: object, isMainnet: boolean): object {
  return signUserSignedAction(
    wallet,
    action,
    [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'maxFeeRate', type: 'string' },
      { name: 'builder', type: 'address' },
      { name: 'nonce', type: 'uint64' },
    ],
    'HyperliquidTransaction:ApproveBuilderFee',
    isMainnet,
  )
}

export function signMultiSigAction(
  wallet: any,
  action: {
    type?: string // `type` is optional if it might not always exist.
    [key: string]: any // Allow other properties.
  },
  isMainnet: boolean,
  vaultAddress: string | null,
  nonce: number,
): object {
  const actionWithoutTag = { ...action }
  delete actionWithoutTag.type // Now this won't throw a type error.
  const multiSigActionHash = actionHash(actionWithoutTag, vaultAddress, nonce)
  return signUserSignedAction(
    wallet,
    { multiSigActionHash, nonce },
    [],
    'HyperliquidTransaction:SendMultiSig',
    isMainnet,
  )
}

export function getTimestampMs(): number {
  return Date.now()
}
