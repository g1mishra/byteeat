"use server"

import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/authOption"

export async function getUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    })
  } catch (error) {
    throw new Error(`Failed to get user: ${(error as Error).message}`)
  }
}

export async function updateUserRole(role: Role) {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    throw new Error("User ID is required")
  }

  try {
    return await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    })
  } catch (error) {
    throw new Error(`Failed to set user role: ${(error as Error).message}`)
  }
}
