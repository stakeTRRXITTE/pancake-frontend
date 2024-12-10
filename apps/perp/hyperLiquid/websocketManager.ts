import WebSocket from 'ws'
import { Any, Subscription, WsMsg } from './utils/types'

export class WebsocketManager {
  private ws: WebSocket

  private wsReady: boolean = false

  private subscriptionIdCounter: number = 0

  private queuedSubscriptions: Array<{ subscription: Subscription; callback: (data: Any) => void }> = []

  private activeSubscriptions: Map<string, Array<{ callback: (data: Any) => void; id: number }>> = new Map()

  constructor(baseUrl: string) {
    const wsUrl = `ws${baseUrl.slice(4)}/ws`
    this.ws = new WebSocket(wsUrl)

    this.ws.on('open', () => this.onOpen())
    this.ws.on('message', (message: string) => this.onMessage(message))
    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  // eslint-disable-next-line class-methods-use-this
  public start(): void {
    console.log('WebSocket Manager has started.')
  }

  public run(): void {
    this.sendPing()
    console.log('WebSocket Manager is running...')
  }

  private sendPing(): void {
    setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ method: 'ping' }))
        console.log('Ping sent to WebSocket server.')
      }
    }, 50000)
  }

  private onOpen(): void {
    console.log('WebSocket connection opened.')
    this.wsReady = true
    this.queuedSubscriptions.forEach(({ subscription, callback }) => {
      this.subscribe(subscription, callback)
    })
    this.queuedSubscriptions = []
  }

  private onMessage(message: string): void {
    if (message === 'Websocket connection established.') {
      console.log(message)
      return
    }

    const wsMsg: WsMsg = JSON.parse(message)
    const identifier = WebsocketManager.wsMsgToIdentifier(wsMsg)

    if (identifier) {
      const subscribers = this.activeSubscriptions.get(identifier) || []
      subscribers.forEach(({ callback }) => callback(wsMsg))
    } else {
      console.warn('Unhandled WebSocket message:', message)
    }
  }

  public subscribe(subscription: Subscription, callback: (data: Any) => void): number {
    const subscriptionId = ++this.subscriptionIdCounter
    const identifier = WebsocketManager.subscriptionToIdentifier(subscription)

    if (!this.wsReady) {
      this.queuedSubscriptions.push({ subscription, callback })
    } else {
      const subscribers = this.activeSubscriptions.get(identifier) || []
      subscribers.push({ callback, id: subscriptionId })
      this.activeSubscriptions.set(identifier, subscribers)
      this.ws.send(JSON.stringify({ method: 'subscribe', subscription }))
    }

    return subscriptionId
  }

  public unsubscribe(subscription: Subscription, subscriptionId: number): boolean {
    const identifier = WebsocketManager.subscriptionToIdentifier(subscription)
    const subscribers = this.activeSubscriptions.get(identifier) || []

    const newSubscribers = subscribers.filter((sub) => sub.id !== subscriptionId)
    if (newSubscribers.length === subscribers.length) {
      return false
    }

    this.activeSubscriptions.set(identifier, newSubscribers)
    if (newSubscribers.length === 0) {
      this.activeSubscriptions.delete(identifier)
      this.ws.send(JSON.stringify({ method: 'unsubscribe', subscription }))
    }

    return true
  }

  private static subscriptionToIdentifier(subscription: Subscription): string {
    switch (subscription.type) {
      case 'allMids':
        return 'allMids'
      case 'l2Book':
        return `l2Book:${subscription.coin.toLowerCase()}`
      case 'trades':
        return `trades:${subscription.coin.toLowerCase()}`
      case 'userEvents':
        return 'userEvents'
      case 'userFills':
        return `userFills:${subscription.user.toLowerCase()}`
      case 'candle':
        return `candle:${subscription.coin.toLowerCase()},${subscription.interval}`
      default:
        throw new Error('Unknown subscription type')
    }
  }

  private static wsMsgToIdentifier(wsMsg: WsMsg): string | null {
    switch (wsMsg.channel) {
      case 'pong':
        console.log('Pong received from WebSocket server.')
        return null
      case 'allMids':
        return 'allMids'
      case 'l2Book':
        return `l2Book:${wsMsg.data.coin.toLowerCase()}`
      case 'trades':
        return `trades:${wsMsg.data[0]?.coin.toLowerCase()}`
      case 'user':
        return 'userEvents'
      case 'userFills':
        return `userFills:${wsMsg.data.user.toLowerCase()}`
      case 'candle':
        return `candle:${wsMsg.data.s.toLowerCase()},${wsMsg.data.i}`
      default:
        return null
    }
  }
}
