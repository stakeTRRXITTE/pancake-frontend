import { TonConnectUIProvider, useTonAddress } from '@tonconnect/ui-react'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { walletAddressAtom } from 'ton/atom/walletAddressAtom'
import { TonContext } from 'ton/context/TonContext'
import { TonContextEvents } from 'ton/ton.enums'
import { Maybe } from 'ton/utils/Maybe'

export const TonContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="/ton-manifest.json">
      <Container>{children}</Container>
    </TonConnectUIProvider>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => {
  const address = useTonAddress()
  const [init, setInit] = useState(false)
  const setAddress = useSetAtom(walletAddressAtom)

  useEffect(() => {
    TonContext.instance.init()
  }, [])

  useEffect(() => {
    const s1 = TonContext.instance.on(TonContextEvents.Connected, () => {
      setAddress(TonContext.instance.getAddress())
      if (!init) {
        setInit(true)
      }
    })

    const s2 = TonContext.instance.on(TonContextEvents.Disconnect, () => {
      setAddress(Maybe.Nothing())
      if (!init) {
        setInit(true)
      }
    })

    return () => {
      s1()
      s2()
    }
  }, [init])

  useEffect(() => {
    if (address) {
      TonContext.instance.connected(address)
    } else {
      TonContext.instance.disconnect()
    }
  }, [address, TonContext.instance])

  if (!init) {
    return null
  }

  return children
}
