import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export function checkAuth(msg?: string) {
  const user = getServerSession(authOptions)
  if (!user) {
    throw new Error(msg || "Your are not authorized to perform this action")
  }
}
