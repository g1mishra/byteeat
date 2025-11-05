"use server"

import { authOptions } from "@/app/api/auth/authOption"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

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
  if (!restroId) {
    throw new Error("Missing restroId")
  }

  try {
    await prisma.userRestaurant.delete({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: restroId,
        },
      },
    })

    revalidatePath("/manage")
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        // The association doesn't exist, so we can consider this a successful removal
        console.log(`No association found for user ${userId} and restaurant ${restroId}`)
      } else {
        throw new Error(`Failed to remove waiter: ${error.message}`)
      }
    } else {
      throw new Error("An unknown error occurred while removing the waiter")
    }
  }
}

export async function createJoiningKey(key: string, restaurantId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  // it was getting called twice from the useEffect
  try {
    const savedKey = await prisma.joiningKey.upsert({
      where: {
        restaurantId: restaurantId,
      },
      update: {
        field: key,
        expiresAt,
      },
      create: {
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
      throw new Error("Joining key expired. Please ask your employer to generate a new key.")
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
