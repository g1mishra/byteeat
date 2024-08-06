"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardIcon } from "@radix-ui/react-icons"
import { GlobeIcon } from "lucide-react"

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
  DashboardIcon,
  Package2Icon,
  ShoppingCartIcon,
  QrCodeIcon,
  PackageIcon,
  UsersIcon,
  LineChartIcon,
  SettingsIcon,
  GlobeIcon,
}

export type SidebarItemType = {
  href: string
  icon: keyof typeof iconMap
  label: string
  exact?: boolean
  target?: string
}

const SidebarItem = ({
  href,
  icon,
  label,
  isActive,
  target,
}: SidebarItemType & {
  isActive: boolean
}) => {
  const Icon = iconMap[icon]
  return href ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          target={target}
          className={`${
            isActive
              ? "bg-primary text-primary-foreground group flex size-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:size-8 md:text-base"
              : "text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:size-8"
          }`}
          prefetch={false}
        >
          <Icon className="size-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : null
}

interface RestroSidebarProps {
  children: React.ReactNode
  sidebarItems: SidebarItemType[]
  hideOn?: string[]
  showLast?: boolean
}

const RestroSidebar = ({
  children,
  sidebarItems = [],
  hideOn = [],
  showLast = true,
}: RestroSidebarProps) => {
  const pathname = usePathname()

  if (
    !sidebarItems.length ||
    (hideOn && hideOn.some((path) => pathname.startsWith(path)))
  ) {
    return <>{children}</>
  }

  const itemsToShow = showLast ? sidebarItems.slice(0, -1) : sidebarItems
  const lastItem = showLast ? sidebarItems[sidebarItems.length - 1] : undefined

  return (
    <div className="flex w-full sm:space-x-4">
      <div className="bg-muted/40 flex min-h-screen w-14 shrink-0 flex-col">
        <aside className="bg-background fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              {itemsToShow.map(({ href, icon, label, exact, target }) => (
                <SidebarItem
                  key={label}
                  href={href}
                  icon={icon}
                  label={label}
                  target={target}
                  isActive={
                    exact ? pathname === href : pathname.startsWith(href)
                  }
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
      <div className="w-full flex-1 overflow-hidden p-4">{children}</div>
    </div>
  )
}

export default RestroSidebar
