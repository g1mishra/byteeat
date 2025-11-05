"use client"

import { registerServiceWorker } from "@/lib/serviceWorkerRegistration"
import { SessionProvider } from "next-auth/react"
import React, { useEffect } from "react"

export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
