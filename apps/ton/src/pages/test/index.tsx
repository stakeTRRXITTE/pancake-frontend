import { useAtomValue } from 'jotai'
import { contractAtom } from 'ton/atom/contractAtom'
import { contractOfTypeAtom } from 'ton/atom/contractOfTypeAtom'
import { isConnectedAtom } from 'ton/atom/isConnectedAtom'
import { walletAddressAtom } from 'ton/atom/walletAddressAtom'
import { balanceOfAtom } from 'ton/logic/balanceOfAtom'
import { TonContractNames, TonContractTypes } from 'ton/ton.enums'

export default () => {
  const isConnected = useAtomValue(isConnectedAtom)
  const address = useAtomValue(walletAddressAtom)
  const contract1 = useAtomValue(
    contractOfTypeAtom({
      type: TonContractTypes.JettonMinter,
      address: 'awefawef',
    }),
  )
  const contract2 = useAtomValue(contractAtom(TonContractNames.CAKE))

  const balanceOfUSDC = useAtomValue(balanceOfAtom(TonContractNames.USDC))
  console.log(isConnected)
  return (
    <div
      style={{
        padding: '20px',
      }}
    >
      <p>Connected: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Address: {address.unwrapOr('-')}</p>
      <p>USDC Balance: {balanceOfUSDC.map((x) => x.toString()).unwrapOr('-')}</p>
    </div>
  )
}
