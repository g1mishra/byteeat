import { Metadata } from "next"
import { redirect } from "next/navigation"
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
    // auth/signin
    return redirect("/api/auth/signin?callbackUrl=/manage")
  }
  return (
    <div className="flex flex-1 flex-col space-y-6 p-4 pb-6 sm:p-10 sm:pb-16">
      <div className="flex justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl  font-bold tracking-tight sm:text-2xl">
            Welcome to ByteEat Restaurant Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your restaurants - menu, tables, and more
          </p>
        </div>
        <AuthUserMenu user={serverSession.user} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-1 flex-col space-y-8 lg:flex-row lg:space-y-0">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
