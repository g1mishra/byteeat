import { PrismaAdapter } from "@next-auth/prisma-adapter"
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
    async session({
      session,
      token,
      user,
    }: {
      session: any
      token: any
      user: any
    }) {
      const tempUser = session?.user
      tempUser["userId"] = user.id
      tempUser["image"] = user.image
      tempUser["phone"] = user.phone
      session.user = tempUser
      return session
    },
  },
}
