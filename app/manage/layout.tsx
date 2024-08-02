import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import RestroSidebar, {
  SidebarItemType,
} from "@/components/manage/RestroSidebar"

import { authOptions } from "../api/auth/authOption"

export const metadata: Metadata = {
  title: "Restaurant Settings - ByteEat 🍔",
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

const SHOW_ON = ["/manage", "/manage/orders"]

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const serverSession = await getServerSession(authOptions)

  if (!serverSession) {
    return redirect("/api/auth/signin?callbackUrl=/manage")
  }
  return (
    <div className="flex w-full">
      <RestroSidebar
        sidebarItems={sidebarItems}
        showOn={SHOW_ON}
        showLast={false}
      />
      <div className="w-full flex-1 p-4 py-6 sm:px-6">{children}</div>
    </div>
  )
}
