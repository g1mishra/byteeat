import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Restaurant Settings - ByteEat 🍔",
  description: "Manage your restaurant - menu, tables, and more",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-1 flex-col space-y-6 p-4 pb-6 sm:p-10 sm:pb-16">
      <div className="space-y-0.5">
        <h2 className="text-xl  font-bold tracking-tight sm:text-2xl">
          Welcome to ByteEat Restaurant Dashboard
        </h2>
        <p className="text-muted-foreground">
          Manage your restaurants - menu, tables, and more
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-1 flex-col space-y-8 lg:flex-row lg:space-y-0">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
