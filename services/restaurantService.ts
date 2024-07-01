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

const fetchRestaurants = async () => {
  try {
    return await prisma.restaurant.findMany()
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
        ItemCategory: {
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
      },
    })
  } catch (error) {
    throw error
  }
}
const fetchRestaurant = async (
  restaurantId: string,
  options?: {
    includeMenuItems: boolean
    includePrice: boolean
  }
) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      include: {
        ItemCategory: {
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
    restaurantData["slug"] = Slugify(
      `${restaurantData.name} ${restaurantData.city}`
    )
    checkAuth("You are not authorized to create a restaurant")
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
    checkAuth("You are not authorized to update this restaurant")

    return await prisma.restaurant.update({
      where: {
        id: restaurantData.id,
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
    checkAuth("You are not authorized to delete this restaurant")
    await prisma.restaurant.delete({
      where: {
        id: restaurantId,
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

  checkAuth("You are not authorized to update this restaurant")

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
  fetchRestaurants,
  getRestaurantSlug,
  updateRestaurant,

  addOrUpdateSocialLinks,
}
