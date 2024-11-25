// import { Card } from '@pancakeswap/widgets-internal'
import styled from 'styled-components'
import Page from 'views/Page'

const ColorBox = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px;
`

export const TonSwapV2 = () => {
  return (
    <Page>
      <h1>Swap</h1>
      <ColorBox>Swap</ColorBox>
      {/* <Card>This card is rendered inside a widget</Card> */}

      {/* 
       <Page removePadding hideFooterOnDesktop={isChartExpanded || false} showExternalLink={false} showHelpLink>
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        position="relative"
        mt={isChartExpanded ? undefined : isMobile ? '18px' : '42px'}
        p={isChartExpanded ? undefined : isMobile ? '16px' : '24px'}
      >
        {isDesktop && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {!isDesktop && isChartSupported && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isFullWidthContainer
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={(isOpen) => setIsChartDisplayed?.(isOpen)}
          />
        )}
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100%"
          width={isChartDisplayed && !isMobile ? 'auto' : '100%'}
          mt={isChartExpanded && !isMobile ? '42px' : undefined}
        >
          <StyledSwapContainer
            justifyContent="center"
            width="100%"
            style={{ height: '100%' }}
            $isChartExpanded={isChartExpanded}
          >
            <Wrapper height="100%">
              <V4SwapForm />
            </Wrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
      */}
    </Page>
  )
}
