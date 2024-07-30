import { Metadata } from "next"
import { redirect } from "next/navigation"
import { fetchRestaurant } from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import { Separator } from "@/components/ui/separator"
import AuthUserMenu from "@/components/AuthUserMenu"

import { authOptions } from "../api/auth/authOption"

export const metadata: Metadata = {
  title: "Restaurant Settings - ByteEat 🍔",
  description: "Manage your restaurant - menu, tables, and more",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const serverSession = await getServerSession(authOptions)

  if (!serverSession) {
    return redirect("/api/auth/signin?callbackUrl=/manage")
  }
  return <>{children}</>
}
