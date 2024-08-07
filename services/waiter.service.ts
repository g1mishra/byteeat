"use server"

import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/authOption"

export async function getWaiters(restroId: string) {
  try {
    return await prisma.user.findMany({
      where: {
        role: Role.WAITER,
        userRestaurants: {
          some: {
            restaurantId: restroId,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(`Failed to get user: ${(error as Error).message}`)
  }
}

export async function removeWaiter(userId: string, restroId: string | null) {
  console.log("userid", userId)
  if (!restroId) {
    throw new Error("Missing restroId")
  }

  try {
    // await prisma.userRestaurant.delete({
    //   where: {
    // userId_restaurantId: {
    //   userId,
    //   restaurantId: restroId,
    // },
    //   },
    // })

    revalidatePath("/manage")
  } catch (error) {
    throw new Error(`Failed to get user: ${(error as Error).message}`)
  }
}

export async function createJoiningKey(key: string, restaurantId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  try {
    const savedKey = await prisma.joiningKey.create({
      data: {
        field: key,
        restaurantId,
        expiresAt,
      },
    })

    revalidatePath("/manage")
    return savedKey
  } catch (error) {
    throw new Error(`Failed to update joining key: ${(error as Error).message}`)
  }
}

export async function updateJoiningKey(key: string, restaurantId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  try {
    const savedKey = await prisma.joiningKey.update({
      where: {
        restaurantId,
      },
      data: {
        field: key,
        expiresAt,
      },
    })

    revalidatePath("/manage")
    return savedKey
  } catch (error) {
    throw new Error(`Failed to update joining key: ${(error as Error).message}`)
  }
}

export async function validateJoiningKey(key: string) {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  try {
    const savedKey = await prisma.joiningKey.findFirst({
      where: {
        field: key,
      },
    })

    if (!savedKey) {
      throw new Error("Joining key not found")
    }

    const isValid = savedKey?.expiresAt && savedKey.expiresAt > new Date()

    if (!isValid) {
      throw new Error(
        "Joining key expired. Please ask your employer to generate a new key."
      )
    }

    const userRestaurant = await prisma.userRestaurant.create({
      data: {
        user: {
          connect: { id: session.user.id },
        },
        restaurant: {
          connect: { id: savedKey.restaurantId },
        },
      },
    })

    revalidatePath("/manage")
    return userRestaurant
  } catch (error) {
    throw new Error(`Failed to update joining key: ${(error as Error).message}`)
  }
}
