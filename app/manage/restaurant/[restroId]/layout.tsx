"use server"

import { getRestaurantSlug } from "@/services/restaurantService"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import RestroSidebar, {
  SidebarItemType,
} from "@/components/manage/RestroSidebar"
import { authOptions } from "@/app/api/auth/authOption"

const RestroLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { restroId: string }
}) => {
  const response = await getRestaurantSlug(params.restroId)
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Session not found")

  const sidebarItems: SidebarItemType[] = [
    {
      href: `/manage`,
      icon: "DashboardIcon",
      label: "Manage",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}`,
      icon: "Package2Icon",
      label: "Dashboard",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}/orders`,
      icon: "ShoppingCartIcon",
      label: "Orders",
    },
    {
      href: `/manage/restaurant/${params.restroId}/qr-code`,
      icon: "QrCodeIcon",
      label: "QR Code",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}/waiters`,
      icon: "UsersIcon",
      label: "Waiters",
    },
    // { href: "#", icon: "PackageIcon", label: "Products" },
    // { href: "#", icon: "UsersIcon", label: "Customers" },
    { href: "#", icon: "LineChartIcon", label: "Analytics" },
    // { href: "#", icon: "SettingsIcon", label: "Settings" },
    {
      href: `/${response?.slug}`,
      icon: "GlobeIcon",
      label: "Menu Preview",
      target: "_blank",
    },
    // profile
  ]

  if (session.user.role === Role.OWNER) {
    sidebarItems.push({
      label: "Settings",
      icon: "SettingsIcon",
      href: `/manage/restaurant/${params.restroId}/edit`,
      exact: true,
    })
  }

  return <RestroSidebar sidebarItems={sidebarItems} showLast={session.user.role === Role.OWNER}>{children}</RestroSidebar>
}

export default RestroLayout
