"use server"

import prisma from "@/lib/prisma"
import { Slugify } from "@/lib/string"

import { MenuItemI } from "./menuService"

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
      },
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

const addRestaurant = async (restaurantData: RestaurantI) => {
  try {
    restaurantData["slug"] = Slugify(
      `${restaurantData.name} ${restaurantData.city}`
    )
    return await prisma.restaurant.create({
      data: restaurantData as RestaurantI & {
        slug: string
      },
    })
  } catch (error) {
    throw error
  }
}

const updateRestaurant = async (restaurantData: RestaurantI) => {
  try {
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
    await prisma.restaurant.delete({
      where: {
        id: restaurantId,
      },
    })
  } catch (error) {
    throw error
  }
}

export {
  addRestaurant,
  deleteRestaurant,
  fetchRestaurant,
  fetchRestaurants,
  updateRestaurant,
  fetchRestaurantBySlug,
}
