"use client"

// https://github.com/nextauthjs/next-auth/issues/5647
import { SessionProvider } from "next-auth/react"

export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}
