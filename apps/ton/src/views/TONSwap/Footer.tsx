import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, LinkExternal } from '@pancakeswap/uikit'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center">
      <Link href="##" color="primary60">
        {t('Bridge Assets to TON Chain')}
        <LinkExternal width={24} color="primary60" />
      </Link>
    </Flex>
  )
}
