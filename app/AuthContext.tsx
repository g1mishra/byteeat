"use client"

import React, { useEffect } from "react"
import { SessionProvider } from "next-auth/react"

import { registerServiceWorker } from "@/lib/serviceWorkerRegistration"

export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
