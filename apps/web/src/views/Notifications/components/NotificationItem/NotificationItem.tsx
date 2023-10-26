import { useTranslation } from '@pancakeswap/localization'
import { Box, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Row, Text } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ContentsContainer,
  Description,
  ExpandButton,
  NoNotificationsWrapper,
  NotificationsWrapper,
  StyledLink,
  StyledNotificationWrapper,
} from 'views/Notifications/styles'
import { formatTime } from 'views/Notifications/utils/date'
import FlexRow from 'views/Predictions/components/FlexRow'

interface INotificationprops {
  title: string
  description: string
  date: number
  url: string
  image?: string | undefined
}

interface INotificationContainerProps {
  notifications: NotifyClientTypes.NotifyMessageRecord[]
  isClosing: boolean
}

const formatStringWithNewlines = (inputString: string) => {
  return inputString.split('\n').map((line: string, index: number) => (
    // eslint-disable-next-line react/no-array-index-key
    <Text key={`message-line-${index}`} lineHeight="15px" color="textSubtle">
      {line}
    </Text>
  ))
}

const NotificationItem = ({ title, description, date, image, url }: INotificationprops) => {
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const formattedDate = formatTime(Math.floor(date / 1000).toString())
  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const formatedDescription = formatStringWithNewlines(description)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (target.tagName !== 'BUTTON') setShow(!show)
    },
    [show],
  )

  useEffect(() => {
    if (contentRef.current) setElementHeight(contentRef.current.scrollHeight)
  }, [])

  return (
    <StyledNotificationWrapper ref={containerRef} onClick={handleExpandClick}>
      <ContentsContainer>
        <Box marginRight="12px" display="flex" minWidth="50px">
          <Image src={image?.toString() ?? '/logo.png'} alt="Notification Image" height={65} width={65} unoptimized />
        </Box>
        <Flex flexDirection="column" width="100%">
          <Text fontWeight="bold">{title}</Text>
          <Description ref={contentRef} show={show} elementHeight={elementHeight}>
            <Text> {formatedDescription}</Text>
            {url !== '' ? (
              <StyledLink hidden href={url} target="_blank" rel="noreferrer noopener">
                {t('View Link')}
              </StyledLink>
            ) : null}
          </Description>
          <BottomRow show={show} formattedDate={formattedDate} elementHeight={elementHeight} />
        </Flex>
      </ContentsContainer>
    </StyledNotificationWrapper>
  )
}

const BottomRow = ({
  show,
  formattedDate,
  elementHeight,
}: {
  show: boolean
  formattedDate: string
  elementHeight: number
}) => {
  const { t } = useTranslation()
  return (
    <Row justifyContent={elementHeight > 35 ? 'space-between' : 'flex-end'} marginTop="6px">
      {elementHeight > 35 ? (
        <FlexRow>
          <ExpandButton color="secondary" fontSize="15px">
            {show ? t('Show Less') : t('Show More')}
          </ExpandButton>
          {show ? <ChevronUpIcon color="secondary" /> : <ChevronDownIcon color="secondary" />}
        </FlexRow>
      ) : null}
      <Text fontSize="15px" marginRight="8px">
        {formattedDate}
      </Text>
    </Row>
  )
}

const NotificationContainer = ({ notifications, isClosing }: INotificationContainerProps) => {
  const { t } = useTranslation()
  if (notifications.length === 0) {
    return (
      <NoNotificationsWrapper>
        <Box paddingY="24px" height="100%">
          <FlexGap paddingX="26px" rowGap="8px" flexDirection="column" justifyContent="center" alignItems="center">
            <Box minHeight="122px">
              <Image src="/images/notifications/notification-bell-onboard.png" alt="#" height={100} width={100} />
            </Box>
            <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
              {t('All Set')}
            </Text>
            <Text fontSize="16px" textAlign="center" color="textSubtle">
              {t(
                'Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet.',
              )}
            </Text>
          </FlexGap>
        </Box>
      </NoNotificationsWrapper>
    )
  }
  return (
    <NotificationsWrapper isClosing={isClosing}>
      {notifications.map((notification: NotifyClientTypes.NotifyMessageRecord) => {
        return (
          <NotificationItem
            key={notification.id}
            title={notification.message.title}
            description={notification.message.body}
            date={notification.publishedAt}
            url={notification.message.url}
            image={notification.message.icon}
          />
        )
      })}
    </NotificationsWrapper>
  )
}

export default NotificationContainer
