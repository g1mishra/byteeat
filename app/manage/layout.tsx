import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import RestroSidebar, {
  SidebarItemType,
} from "@/components/manage/RestroSidebar"

import { authOptions } from "../api/auth/authOption"

export const metadata: Metadata = {
  title: "Restaurant Settings",
  description: "Manage your restaurant - menu, tables, and more",
}

const sidebarItems: SidebarItemType[] = [
  {
    href: `/manage`,
    icon: "DashboardIcon",
    label: "Manage",
    exact: true,
  },
  {
    href: "/manage/orders",
    icon: "ShoppingCartIcon",
    label: "Orders",
  },
  { href: "#", icon: "LineChartIcon", label: "Analytics" },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

const HIDE_ON = ["/manage/restaurant"]

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const serverSession = await getServerSession(authOptions)

  if (!serverSession) {
    return redirect("/api/auth/signin?callbackUrl=/manage")
  }

  if (!serverSession.user.role) {
    return redirect("/onboarding")
  }

  return (
    <RestroSidebar
      sidebarItems={sidebarItems}
      hideOn={HIDE_ON}
      showLast={false}
    >
      {children}
    </RestroSidebar>
  )
}
