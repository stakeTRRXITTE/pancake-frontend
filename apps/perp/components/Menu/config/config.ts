import { ContextApi } from '@pancakeswap/localization'
import { AllBlogIcon, DropdownMenuItems, MenuItemsType } from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item: any, chainId: any) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (t: ContextApi['t'], chainId?: number) => ConfigMenuItemsType[] = (t, chainId) =>
  [
    {
      label: t('Home'),
      href: '/',
      items: [],
      icon: AllBlogIcon,
      showOnMobile: false,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
