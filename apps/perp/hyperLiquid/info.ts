import { API } from './api'
import { Any, Meta, SpotMeta, Subscription } from './utils/types'
import { WebsocketManager } from './websocketManager'

export class Info extends API {
  private wsManager?: WebsocketManager

  private coinToAsset: Record<string, number> = {}

  private nameToCoin: Record<string, string> = {}

  constructor(baseUrl?: string, skipWs: boolean = false, meta?: Meta, spotMeta?: SpotMeta) {
    super(baseUrl)

    if (!skipWs) {
      this.wsManager = new WebsocketManager(baseUrl || '')
      this.wsManager.start()
    }

    if (!meta) {
      this.initMeta()
    }

    if (!spotMeta) {
      this.initSpotMeta()
    }
  }

  private async initMeta(): Promise<void> {
    const meta = await this.meta()
    meta.universe.forEach((assetInfo, asset) => {
      this.coinToAsset[assetInfo.name] = asset
      this.nameToCoin[assetInfo.name] = assetInfo.name
    })
  }

  private async initSpotMeta(): Promise<void> {
    const spotMeta = await this.spotMeta()
    spotMeta.universe.forEach((spotInfo) => {
      this.coinToAsset[spotInfo.name] = spotInfo.index + 10000
      this.nameToCoin[spotInfo.name] = spotInfo.name
    })
  }

  public getNameToCoin(name: string): string {
    if (!(name in this.nameToCoin)) {
      throw new Error(`Coin name ${name} not found.`)
    }
    return this.nameToCoin[name]
  }

  async meta(): Promise<Meta> {
    return (await this.post('/info', { type: 'meta' })) as Meta
  }

  async spotMeta(): Promise<SpotMeta> {
    return (await this.post('/info', { type: 'spotMeta' })) as SpotMeta
  }

  async userState(address: string): Promise<Any> {
    return this.post('/info', { type: 'clearinghouseState', user: address })
  }

  async spotUserState(address: string): Promise<Any> {
    return this.post('/info', { type: 'spotClearinghouseState', user: address })
  }

  async openOrders(address: string): Promise<Any> {
    return this.post('/info', { type: 'openOrders', user: address })
  }

  async allMids(): Promise<Record<string, string>> {
    return this.post('/info', { type: 'allMids' })
  }

  subscribe(subscription: Subscription, callback: (data: Any) => void): number {
    if (!this.wsManager) {
      throw new Error('Websocket Manager is not initialized')
    }

    const subscriptionId = this.wsManager.subscribe(subscription, callback)
    if (typeof subscriptionId !== 'number') {
      throw new Error('Invalid subscription ID returned by Websocket Manager')
    }

    return subscriptionId
  }

  unsubscribe(subscription: Subscription, subscriptionId: number): boolean {
    if (!this.wsManager) {
      throw new Error('Websocket Manager is not initialized')
    }

    const unsubscribed = this.wsManager.unsubscribe(subscription, subscriptionId)
    if (typeof unsubscribed !== 'boolean') {
      throw new Error('Invalid unsubscribe result returned by Websocket Manager')
    }

    return unsubscribed
  }

  nameToAsset(name: string): number {
    return this.coinToAsset[this.nameToCoin[name]]
  }
}
