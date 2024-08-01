"use server"

import prisma from "@/lib/prisma"
import { Slugify } from "@/lib/string"

import { checkAuth } from "./utils.service"

export type FullAdress = {
  address_string: string
  city: string
  state: string
  country: string
}
interface RestaurantI extends FullAdress {
  id?: string
  name: string
  tableSize: number
  slug?: string
}

const fetchRestaurants = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required")
  }
  try {
    return await prisma.restaurant.findMany({
      where: {
        userId: userId,
      },
    })
  } catch (error) {
    throw error
  }
}

const getRestaurantIdBySlug = async (restaurantSlug: string) => {
  if (!restaurantSlug) {
    throw new Error("Restaurant slug is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        slug: restaurantSlug,
      },
      select: {
        id: true,
      },
    })
  } catch (error) {
    throw error
  }
}

const fetchRestaurantBySlug = async (
  restaurantSlug: string,
  options?: {
    includeMenuItems: boolean
    includePrice: boolean
  }
) => {
  if (!restaurantSlug) {
    throw new Error("Restaurant slug is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        slug: restaurantSlug,
      },
      include: {
        ItemCategory: options?.includeMenuItems
          ? {
              orderBy: {
                id: "asc",
              },
              include: {
                Item: {
                  include: options?.includePrice
                    ? {
                        PriceItemMap: true,
                      }
                    : {},
                },
              },
            }
          : false,
        SocialLinks: true,
      },
    })
  } catch (error) {
    throw error
  }
}
const fetchRestaurant = async (
  restaurantId: string,
  userId: string,
  options?: {
    includeMenuItems: boolean
    includePrice: boolean
  }
) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
        userId: userId,
      },
      include: {
        ItemCategory: {
          orderBy: {
            id: "asc",
          },
          include: {
            Item: options?.includeMenuItems
              ? {
                  include: options?.includePrice
                    ? {
                        PriceItemMap: true,
                      }
                    : {},
                }
              : false,
          },
        },
        SocialLinks: true,
      },
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

const getRestaurantSlug = async (restaurantId: string) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      select: {
        slug: true,
      },
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

export type FetchRestaurantReturnType = Awaited<
  ReturnType<typeof fetchRestaurant>
>

const addRestaurant = async (
  restaurantData: RestaurantI & {
    userId: string
  }
) => {
  try {
    let baseSlug = Slugify(`${restaurantData.name} ${restaurantData.city}`)
    let slug = baseSlug

    let existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    })
    let suffix = 1

    // If slug exists, increment suffix until a unique slug is found
    while (existingRestaurant) {
      slug = `${baseSlug}-${suffix}`
      existingRestaurant = await prisma.restaurant.findUnique({
        where: { slug },
      })
      suffix++
    }

    restaurantData["slug"] = slug
    return await prisma.restaurant.create({
      data: restaurantData as RestaurantI & {
        slug: string
        userId: string
      },
    })
  } catch (error) {
    throw error
  }
}

const updateRestaurant = async (restaurantData: Partial<RestaurantI>) => {
  try {
    if (!restaurantData.id) {
      throw new Error("Restaurant ID is required")
    }
    const user = await checkAuth(
      "You are not authorized to update this restaurant"
    )

    return await prisma.restaurant.update({
      where: {
        id: restaurantData.id,
        userId: user?.userId,
      },
      data: restaurantData,
    })
  } catch (error) {
    throw error
  }
}

const deleteRestaurant = async (restaurantId: string): Promise<void> => {
  try {
    if (!restaurantId) {
      throw new Error("Restaurant ID is required")
    }
    const user = await checkAuth(
      "You are not authorized to delete this restaurant"
    )
    await prisma.restaurant.delete({
      where: {
        id: restaurantId,
        userId: user?.userId,
      },
    })
  } catch (error) {
    throw error
  }
}

const addOrUpdateSocialLinks = async (
  restaurantId: string,
  socialLinks: any
) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  await checkAuth("You are not authorized to update this restaurant")

  try {
    return await prisma.socialLinks.upsert({
      where: {
        restaurantId: restaurantId,
      },
      create: {
        ...socialLinks,
        restaurantId: restaurantId,
      },
      update: {
        ...socialLinks,
      },
    })
  } catch (error) {
    console.error("Failed to add or update social links:", error)
    throw new Error(
      "An error occurred while updating social links. Please try again."
    )
  }
}

export {
  addRestaurant,
  deleteRestaurant,
  fetchRestaurant,
  fetchRestaurantBySlug,
  getRestaurantIdBySlug,
  fetchRestaurants,
  getRestaurantSlug,
  updateRestaurant,
  addOrUpdateSocialLinks,
}
