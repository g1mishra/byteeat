"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

export default function RestroSidebar({
  sidebarItems = [],
}: {
  sidebarItems?: SidebarItemType[]
}) {
  const pathname = usePathname()

  return (
    <div className="bg-muted/40 hidden min-h-screen w-14 flex-col sm:flex">
      <aside className="bg-background fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            {sidebarItems.slice(0, -1).map(({ href, icon, label, exact }) => (
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
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <SidebarItem
              href={sidebarItems[sidebarItems.length - 1].href}
              icon={sidebarItems[sidebarItems.length - 1].icon}
              label={sidebarItems[sidebarItems.length - 1].label}
            />
          </TooltipProvider>
        </nav>
      </aside>
    </div>
  )
}

const SidebarItem = ({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: keyof typeof iconMap
  label: string
  isActive?: boolean
}) => {
  // if (!iconMap[icon]) return null
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
