import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../api/auth/authOption"
import AuthPage from "./login-page"

export default async function SignIn({ params, searchParams }: any) {
  const session = await getServerSession(authOptions)
  const callbackUrl = searchParams?.callbackUrl || "/manage"
  if (session) return redirect(callbackUrl)

  return (
    <>
      <AuthPage />
    </>
  )
}
