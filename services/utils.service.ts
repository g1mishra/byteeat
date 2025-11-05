import { authOptions } from "@/app/api/auth/authOption"
import { getServerSession } from "next-auth"

export async function checkAuth(msg?: string): Promise<{
  name: string | null
  email: string
  image: string | null
  phone: string | null
  id: string
}> {
  const session = await getServerSession(authOptions)
  if (!session || !session?.user) {
    throw new Error(msg || "Your are not authorized to perform this action")
  }
  return session?.user
}
