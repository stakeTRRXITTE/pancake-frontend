import { useCountdown } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  LinkExternalAction,
  PancakeSwapBadge,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew'; target?: string }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const StyledImage = styled.img`
  margin-left: 10px;
  width: 76px;
  height: 20px;
`

const BASE_PATH = `${ASSET_CDN}/web/banners/ifo/eigenpie`
const partnerLogo = `${BASE_PATH}/eigenpie-badge.png`
const networkLogo = `${BASE_PATH}/arbitrum-badge.png`

const primaryLink = '/ifo?chain=arb&utm_source=Homepage&utm_medium=website&utm_campaign=Eigenpie&utm_id=IFO'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/pancake-swap-launches-first-ifo-on-arbitrum-featuring-eigenpie?utm_source=Homepage&utm_medium=website&utm_campaign=Eigenpie&utm_id=IFO'

const bgXsVariant: GraphicDetail = {
  src: `${BASE_PATH}/bg-mobile.png`,
  width: 272,
  height: 224,
}

const bgMdVariant: GraphicDetail = {
  src: `${BASE_PATH}/bg-tablet.png`,
  // width: 544,
  // height: 448,
  width: 196,
  height: 164,
}

const bgXlVariant: GraphicDetail = {
  src: `${BASE_PATH}/bg-desktop.png`,
  width: 196,
  height: 164,
}

const yellowVariant = {
  color: '#F4D045',
  strokeColor: '#1C0053',
  strokeSize: 2.5,
  fontSize: 36,
  lineHeight: 30,
  fontWeight: 900,
}

const DisclaimerText = styled(Text).attrs({ bold: true })`
  position: absolute;
  color: #eee;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  bottom: 24px;
  right: 24px;
  z-index: 10;
  font-size: 7px;
  width: 160px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
    width: 400px;
  }
`

const CountDownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: self-start;
  width: fit-content;
  background-color: #b8b5d9;
  font-family: Kanit;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 90%;
  color: #08060b;
  padding: 6px;
  border-radius: 8px;
  margin-top: 10px;
  gap: 0px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 8px;
    padding: 8px;
    font-size: 20px;
    line-height: 110%; /* 22px */
  }
`

export function Countdown() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const countdown = useCountdown(1727172900)
  if (!countdown) {
    return null
  }
  const hours = countdown?.hours < 10 ? `0${countdown?.hours}` : countdown?.hours
  const minutes = countdown?.minutes < 10 ? `0${countdown?.minutes}` : countdown?.minutes
  return (
    <CountDownWrapper>
      <Box style={{ fontSize: isMobile ? '12px' : '20px' }}>{t('Starts in')}</Box>
      <Box>
        0{countdown?.days}d:{hours}h:{minutes}m
      </Box>
    </CountDownWrapper>
  )
}

export const EigenpieIFOBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color} target={props.target}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="linear-gradient(90deg, #17114F 0%, #4648A2 100%)">
      <BannerMain
        badges={
          <Flex alignItems="center" justifyContent="start" flexWrap="wrap">
            <PancakeSwapBadge whiteText />
            {!isMobile && (
              <div>
                <StyledImage src={partnerLogo} alt="eigenpie-logo" />
                <StyledImage src={networkLogo} alt="arbitrum-badge" />
              </div>
            )}
          </Flex>
        }
        title={<BannerTitle variant={yellowVariant}>{t('Eigenpie IFO')}</BannerTitle>}
        desc={<Countdown />}
        actions={
          <BannerActionContainer>
            <Action
              href={primaryLink}
              display="flex"
              icon="arrowForward"
              alignItems="center"
              text={t('Join IFO')}
              color="white"
            />
            <Action
              href={learnMoreLink}
              icon="openNew"
              display={isMobile ? 'none' : 'flex'}
              alignItems="center"
              text={t('Learn More')}
              color="white"
            />
          </BannerActionContainer>
        }
      />

      {isMobile && (
        <Flex
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            zIndex: 10,
          }}
        >
          <StyledImage src={partnerLogo} alt="eigenpie-logo" />

          <StyledImage src={networkLogo} alt="arbitrum-badge" />
        </Flex>
      )}

      <DisclaimerText>
        {t(
          'This is not investment advice. Participation involves risks and may be restricted in some regions. Please ensure compliance with local laws and regulations before participating.',
        )}
      </DisclaimerText>

      <BannerGraphics>
        <BackgroundGraphic
          src={`${BASE_PATH}/bg-desktop.png`}
          xs={bgXsVariant}
          md={bgMdVariant}
          xl={bgXlVariant}
          width={469}
          height={224}
        />
      </BannerGraphics>
    </BannerContainer>
  )
}