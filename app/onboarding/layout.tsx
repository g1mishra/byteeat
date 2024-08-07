import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "../api/auth/authOption"

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set role for your account",
}

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export default async function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  const serverSession = await getServerSession(authOptions)

  if (!serverSession) {
    return redirect("/api/auth/signin?callbackUrl=/manage")
  }

  if (serverSession.user.role) {
    redirect("/manage")
  }

  return <div>{children}</div>
}
