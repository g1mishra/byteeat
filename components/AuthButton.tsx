"use client"

import { signIn, signOut } from "next-auth/react"

export const SingOutButton = () => {
  return <button onClick={() => signOut()}>Sign out</button>
}

export const SingInButton = () => {
  return <button onClick={() => signIn()}>Sign In</button>
}
