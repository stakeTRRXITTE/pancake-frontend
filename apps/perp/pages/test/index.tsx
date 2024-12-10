import { useSetup } from 'hyperLiquid/hooks/useSetup'

const TestPage = () => {
  // test for mainnet
  useSetup(false, true)

  return (
    <>
      <>123123</>
    </>
  )
}

export default TestPage
