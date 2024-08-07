import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/lib/prisma"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      const tempUser = session?.user
      tempUser["id"] = user.id
      tempUser["image"] = user.image
      tempUser["phone"] = user.phone
      tempUser["role"] = user.role
      tempUser["name"] = user.name
      tempUser["email"] = user.email
      session.user = tempUser
      return session
    },
  },
}
