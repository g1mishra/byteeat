"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardIcon } from "@radix-ui/react-icons"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  LineChartIcon,
  Package2Icon,
  PackageIcon,
  QrCodeIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "../icons/siderbar-icons"

const iconMap = {
  DashboardIcon: DashboardIcon,
  Package2Icon: Package2Icon,
  ShoppingCartIcon: ShoppingCartIcon,
  QrCodeIcon: QrCodeIcon,
  PackageIcon: PackageIcon,
  UsersIcon: UsersIcon,
  LineChartIcon: LineChartIcon,
  SettingsIcon: SettingsIcon,
}

export type SidebarItemType = {
  href: string
  icon: keyof typeof iconMap
  label: string
  exact?: boolean
}

const SidebarItem = ({
  href,
  icon,
  label,
  isActive,
}: SidebarItemType & {
  isActive: boolean
}) => {
  if (!href) return null
  const Icon = iconMap[icon]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={
            isActive
              ? "bg-primary text-primary-foreground group flex size-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:size-8 md:text-base"
              : "text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:size-8"
          }
          prefetch={false}
        >
          <Icon className="size-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

const RestroSidebar = ({
  sidebarItems = [],
  showOn = [],
  showLast = true,
}: {
  sidebarItems: SidebarItemType[]
  showOn?: string[]
  showLast?: boolean
}) => {
  const pathname = usePathname()

  if (!sidebarItems.length) return null
  if (!showOn.some((path) => pathname.startsWith(path))) return null

  let lastItem: SidebarItemType | undefined

  if (showLast) {
    lastItem = sidebarItems.pop()
  }

  return (
    <div className="bg-muted/40 hidden min-h-screen w-14 flex-col sm:flex">
      <aside className="bg-background fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            {sidebarItems.map(({ href, icon, label, exact }) => (
              <SidebarItem
                key={label}
                href={href}
                icon={icon}
                label={label}
                isActive={exact ? pathname === href : pathname.startsWith(href)}
              />
            ))}
          </TooltipProvider>
        </nav>
        {lastItem && (
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <SidebarItem
                href={lastItem.href}
                icon={lastItem.icon}
                label={lastItem.label}
                isActive={
                  lastItem.exact
                    ? pathname === lastItem.href
                    : pathname.startsWith(lastItem.href)
                }
              />
            </TooltipProvider>
          </nav>
        )}
      </aside>
    </div>
  )
}

export default RestroSidebar
