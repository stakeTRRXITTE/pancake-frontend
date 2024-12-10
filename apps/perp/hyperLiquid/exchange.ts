import { API } from './api'
import { MAINNET_API_URL } from './constants'
import { Info } from './info'
import {
  orderRequestToOrderWire,
  orderWiresToOrderAction,
  signL1Action,
  signSpotTransferAction,
  signUsdClassTransferAction,
  signUsdTransferAction,
  signWithdrawFromBridgeAction,
} from './utils/signing'
import {
  Any,
  BuilderInfo,
  CancelByCloidRequest,
  CancelRequest,
  Cloid,
  Meta,
  ModifyRequest,
  OrderRequest,
  OrderType,
  SpotMeta,
} from './utils/types'

export class Exchange extends API {
  private DEFAULT_SLIPPAGE: number = 0.05

  private wallet: any

  private vaultAddress?: string

  private accountAddress?: string

  private info: Info

  constructor(
    wallet: any,
    baseUrl?: string,
    meta?: Meta,
    vaultAddress?: string,
    accountAddress?: string,
    spotMeta?: SpotMeta,
  ) {
    super(baseUrl)
    this.wallet = wallet
    this.vaultAddress = vaultAddress
    this.accountAddress = accountAddress
    this.info = new Info(baseUrl, true, meta, spotMeta)
  }

  private postAction(action: any, signature: any, nonce: number): any {
    const payload = {
      action,
      nonce,
      signature,
      vaultAddress: action.type !== 'usdClassTransfer' ? this.vaultAddress ?? '' : null,
    }
    return this.post('/exchange', payload)
  }

  private slippagePrice(name: string, isBuy: boolean, slippage: number, px?: number): number {
    const coin = this.info.getNameToCoin(name)
    const price = px ?? parseFloat(this.info.allMids()[coin])
    const adjustedPrice = price * (isBuy ? 1 + slippage : 1 - slippage)
    return parseFloat(adjustedPrice.toPrecision(5))
  }

  public order(
    name: string,
    isBuy: boolean,
    sz: number,
    limitPx: number,
    orderType: OrderType,
    reduceOnly: boolean = false,
    cloid?: Cloid,
    builder?: BuilderInfo,
  ): Any {
    const order: OrderRequest = {
      coin: name,
      isBuy,
      sz,
      limitPx,
      orderType,
      reduceOnly,
      cloid: cloid?.toRaw(),
    }
    return this.bulkOrders([order], builder)
  }

  public bulkOrders(orderRequests: Array<OrderRequest>, builder?: BuilderInfo): Any {
    const localBuilder = { b: builder?.b ?? '', f: builder?.f ?? 0 }
    const orderWires = orderRequests.map((order) => orderRequestToOrderWire(order, this.info.nameToAsset(order.coin)))
    const timestamp = Date.now()
    const orderAction = orderWiresToOrderAction(orderWires, localBuilder)

    const signature = signL1Action(
      this.wallet,
      orderAction,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(orderAction, signature, timestamp)
  }

  public modifyOrder(request: ModifyRequest): Any {
    const timestamp = Date.now()
    const modifyAction = {
      type: 'modifyOrder',
      oid: request.oid,
      order: orderRequestToOrderWire(request.order, this.info.nameToAsset(request.order.coin)),
    }

    const signature = signL1Action(
      this.wallet,
      modifyAction,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(modifyAction, signature, timestamp)
  }

  public cancelOrder(request: CancelRequest): Any {
    const timestamp = Date.now()
    const cancelAction = {
      type: 'cancelOrder',
      coin: request.coin,
      oid: request.oid,
    }

    const signature = signL1Action(
      this.wallet,
      cancelAction,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(cancelAction, signature, timestamp)
  }

  public cancelByCloid(request: CancelByCloidRequest): Any {
    const timestamp = Date.now()
    const cancelAction = {
      type: 'cancelByCloid',
      coin: request.coin,
      cloid: request.cloid,
    }

    const signature = signL1Action(
      this.wallet,
      cancelAction,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(cancelAction, signature, timestamp)
  }

  public withdrawFromBridge(amount: number, toAddress: string): Any {
    const timestamp = Date.now()
    const action = signWithdrawFromBridgeAction(amount, toAddress, timestamp)

    const signature = signL1Action(
      this.wallet,
      action,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(action, signature, timestamp)
  }

  public usdTransfer(toAddress: string, amount: number): Any {
    const timestamp = Date.now()
    const action = signUsdTransferAction(toAddress, amount, timestamp)

    const signature = signL1Action(
      this.wallet,
      action,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(action, signature, timestamp)
  }

  public usdClassTransfer(toAddress: string, className: string, amount: number): Any {
    const timestamp = Date.now()
    const action = signUsdClassTransferAction(toAddress, className, amount, timestamp)

    const signature = signL1Action(
      this.wallet,
      action,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(action, signature, timestamp)
  }

  public spotTransfer(toAddress: string, assetName: string, amount: number): Any {
    const timestamp = Date.now()
    const action = signSpotTransferAction(toAddress, assetName, amount, timestamp)

    const signature = signL1Action(
      this.wallet,
      action,
      this.vaultAddress ?? '',
      timestamp,
      this.getBaseUrl() === MAINNET_API_URL,
    )

    return this.postAction(action, signature, timestamp)
  }
}
