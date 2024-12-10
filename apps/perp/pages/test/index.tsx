import { useSetup } from 'hyperLiquid/hooks/useSetup'

const TestPage = () => {
  // For testnet
  const { address, info, exchange } = useSetup(false, true)
  console.log(address, info, exchange)

  return (
    <>
      <>123123</>
    </>
  )
}

export default TestPage
