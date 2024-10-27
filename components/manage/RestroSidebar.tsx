"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  ClipboardIcon,
  ClipboardListIcon,
  GlobeIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PencilIcon,
  PlusCircleIcon,
  QrCodeIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
type IconType = typeof HomeIcon
interface IconMapType {
  [key: string]: IconType
}

export interface SidebarItemType {
  href: string
  icon: keyof typeof iconMap
  label: string
  exact?: boolean
  target?: string
}

interface SidebarItemProps extends SidebarItemType {
  isActive: boolean
}

interface RestroSidebarProps {
  children: React.ReactNode
  sidebarItems: SidebarItemType[]
  hideOn?: string[]
  showLast?: boolean
}

interface MobileMoreMenuProps {
  items: SidebarItemType[]
  pathname: string
}

// Constants
const MOBILE_MAIN_ITEMS_COUNT = 4

// Icon mapping
const iconMap: IconMapType = {
  HomeIcon,
  LayoutDashboardIcon,
  ShoppingBagIcon,
  ClipboardIcon,
  QrCodeIcon,
  PackageIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  GlobeIcon,
  ListOrderedIcon,
  PencilIcon,
  PlusCircleIcon,
  ClipboardListIcon,
}

// Memoized Components
const SidebarItem = React.memo(({ href, icon, label, isActive, target }: SidebarItemProps) => {
  const Icon = iconMap[icon]

  if (!href) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          target={target}
          className={`flex size-9 items-center justify-center rounded-lg transition-colors md:size-8 ${
            isActive
              ? "bg-primary text-primary-foreground group shrink-0 gap-2 rounded-full text-lg font-semibold md:text-base"
              : "text-muted-foreground hover:text-foreground"
          }`}
          prefetch={false}
        >
          <Icon className="size-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
})

SidebarItem.displayName = "SidebarItem"

const MobileMoreMenu = React.memo(({ items, pathname }: MobileMoreMenuProps) => {
  const menuItems = useMemo(
    () =>
      items.map((item) => (
        <DropdownMenuItem key={item.label} asChild>
          <Link href={item.href} className="flex items-center gap-2 px-4 py-2" target={item.target}>
            {React.createElement(iconMap[item.icon], { className: "size-4" })}
            <span>{item.label}</span>
          </Link>
        </DropdownMenuItem>
      )),
    [items]
  )

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors">
              <MoreHorizontalIcon className="size-5" />
              <span className="sr-only">More</span>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">More</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="top" align="center" className="mb-2">
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

MobileMoreMenu.displayName = "MobileMoreMenu"

const RestroSidebar = ({
  children,
  sidebarItems = [],
  hideOn = [],
  showLast = true,
}: RestroSidebarProps) => {
  const pathname = usePathname()

  const { mobileMainItems, mobileMoreItems, lastItem } = useMemo(
    () => ({
      mobileMainItems: sidebarItems.slice(0, MOBILE_MAIN_ITEMS_COUNT),
      mobileMoreItems: sidebarItems.slice(MOBILE_MAIN_ITEMS_COUNT),
      lastItem: showLast ? sidebarItems[sidebarItems.length - 1] : undefined,
    }),
    [sidebarItems, showLast]
  )

  const renderSidebarItems = useMemo(
    () =>
      sidebarItems
        .slice(0, showLast ? -1 : undefined)
        .map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
          />
        )),
    [sidebarItems, pathname, showLast]
  )

  // Early return if no items or should be hidden
  if (!sidebarItems.length || hideOn.some((path) => pathname.startsWith(path))) {
    return <>{children}</>
  }

  return (
    <div className="flex w-full flex-col sm:flex-row sm:space-x-4">
      <div className="sm:bg-muted/40 fixed inset-x-0 bottom-0 z-50 flex h-16 w-full flex-row justify-around border-t bg-white/90 sm:relative sm:h-screen sm:w-14 sm:flex-col sm:border-r sm:border-t-0">
        <aside className="flex size-full flex-row items-center justify-around sm:fixed sm:inset-y-0 sm:left-0 sm:z-10 sm:w-14 sm:flex-col">
          <nav className="flex w-full flex-row items-center justify-around px-2 sm:h-full sm:flex-col sm:gap-4 sm:py-5">
            <TooltipProvider>
              {/* Mobile View */}
              <div className="flex w-full justify-around sm:hidden">
                {mobileMainItems.map((item) => (
                  <SidebarItem
                    key={item.label}
                    {...item}
                    isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                  />
                ))}
                {mobileMoreItems.length > 0 && (
                  <MobileMoreMenu items={mobileMoreItems} pathname={pathname} />
                )}
              </div>

              <div className="hidden h-full justify-evenly sm:flex sm:flex-col sm:gap-4">
                {renderSidebarItems}
              </div>
            </TooltipProvider>
          </nav>

          {lastItem && (
            <nav className="hidden sm:mt-auto sm:flex sm:flex-col sm:items-center sm:gap-4 sm:px-2 sm:py-5">
              <TooltipProvider>
                <SidebarItem
                  {...lastItem}
                  isActive={
                    lastItem.exact ? pathname === lastItem.href : pathname.startsWith(lastItem.href)
                  }
                />
              </TooltipProvider>
            </nav>
          )}
        </aside>
      </div>
      <div className="w-full flex-1 overflow-hidden p-4 pb-20 sm:pb-4">{children}</div>
    </div>
  )
}

export default React.memo(RestroSidebar)
