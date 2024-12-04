import { TonClient } from '@ton/ton'
import { TonContextEvents, TonNetworks } from 'ton/ton.enums'
import { Emiter } from 'ton/utils/Emiter'
import { Maybe } from 'ton/utils/Maybe'
import { TonEndPoints } from './endpoints'

export class TonContext extends Emiter<TonContextEvents> {
  private tonClient?: TonClient

  private network?: TonNetworks

  private address: Maybe<string> = Maybe.Nothing()

  private walletState: 'connected' | 'disconnected' = 'disconnected'

  constructor() {
    super()
  }

  public init() {
    this.network = TonContext.detectNetwork()
    this.tonClient = new TonClient({ endpoint: TonEndPoints[this.network] })
  }

  private static detectNetwork() {
    const isProd = process.env.NODE_ENV === 'production'
    const guess = isProd ? TonNetworks.Mainnet : TonNetworks.Testnet
    const url = new URL(window.location.href)
    const network: TonNetworks = TonNetworks[url.searchParams.get('chain') || guess]
    return network
  }

  public getNetwork() {
    return this.network
  }

  public getClient() {
    return this.tonClient!
  }

  public getAddress() {
    return this.address
  }

  public getWalletState() {
    return this.walletState
  }

  public connected(address: string) {
    const prev = this.walletState
    this.walletState = 'connected'
    this.address = Maybe.Just(address)
    if (prev !== this.walletState) {
      this.emit(TonContextEvents.Connected, address)
    }
  }

  public disconnect() {
    this.address = Maybe.Nothing()
    const prev = this.walletState
    this.walletState = 'disconnected'
    if (prev !== this.walletState) {
      this.emit(TonContextEvents.Disconnect)
    }
  }

  public static instance = new TonContext()
}
