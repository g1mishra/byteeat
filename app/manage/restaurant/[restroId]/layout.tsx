"use server"

import { getRestaurantSlug } from "@/services/restaurantService"

import RestroSidebar, {
  SidebarItemType,
} from "@/components/manage/RestroSidebar"

const RestroLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { restroId: string }
}) => {
  const response = await getRestaurantSlug(params.restroId)

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
    // { href: "#", icon: "PackageIcon", label: "Products" },
    // { href: "#", icon: "UsersIcon", label: "Customers" },
    { href: "#", icon: "LineChartIcon", label: "Analytics" },
    // { href: "#", icon: "SettingsIcon", label: "Settings" },
    {
      label: "Settings",
      icon: "SettingsIcon",
      href: `/manage/restaurant/${params.restroId}/edit`,
      exact: true,
    },
    // profile
  ]

  return <RestroSidebar sidebarItems={sidebarItems}>{children}</RestroSidebar>
}

export default RestroLayout
