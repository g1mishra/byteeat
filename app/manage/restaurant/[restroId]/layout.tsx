"use server"

import { authOptions } from "@/app/api/auth/authOption"
import RestroSidebar, { SidebarItemType } from "@/components/manage/RestroSidebar"
import { getBasePath } from "@/lib/utils"
import { getRestaurantSlug } from "@/services/restaurantService"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const RestroLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { restroId: string }
}) => {
  const response = await getRestaurantSlug(params.restroId)
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/manage")
  }

  const sidebarItems: SidebarItemType[] = [
    {
      href: `/manage`,
      icon: "HomeIcon",
      label: "Manage",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}`,
      icon: "LayoutDashboardIcon",
      label: "Dashboard",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}/manual-order`,
      icon: "PlusCircleIcon",
      label: "Manual Order",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}/orders`,
      icon: "ShoppingBagIcon",
      label: "Orders",
    },
    {
      href: `/manage/restaurant/${params.restroId}/qr-code`,
      icon: "QrCodeIcon",
      label: "QR Code",
      exact: true,
    },
    {
      href: `/manage/restaurant/${params.restroId}/analytics`,
      icon: "BarChart3Icon",
      label: "Analytics",
    },

    // Remove the addons item from here
  ]

  if (session.user.role === Role.OWNER) {
    sidebarItems.push({
      href: `/manage/restaurant/${params.restroId}/waiters`,
      icon: "UsersIcon",
      label: "Waiters",
    })
  }

  if (response?.slug) {
    sidebarItems.push({
      href: getBasePath(response.slug),
      icon: "GlobeIcon",
      label: "Live Menu",
      target: "_blank",
    })
  }

  return (
    <RestroSidebar sidebarItems={sidebarItems} showLast={false}>
      {children}
    </RestroSidebar>
  )
}

export default RestroLayout
