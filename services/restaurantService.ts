"use server"

import prisma from "@/lib/prisma"

import { MenuItemI } from "./menuService"

interface RestaurantI {
  id?: number
  name: string
  tableSize: number
  address_string: string,
  city: string,
  state: string,
  country: string
}

const fetchRestaurants = async (): Promise<RestaurantI[]> => {
  try {
    return await prisma.restaurant.findMany()
  } catch (error) {
    throw error
  }
}

const fetchRestaurant = async (
  restaurantId: number,
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
    throw error
  }
}

const addRestaurant = async (
  restaurantData: RestaurantI
): Promise<RestaurantI> => {
  try {
    return await prisma.restaurant.create({
      data: restaurantData,
    })
  } catch (error) {
    throw error
  }
}

const updateRestaurant = async (
  restaurantData: RestaurantI
): Promise<RestaurantI> => {
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

const deleteRestaurant = async (restaurantId: number): Promise<void> => {
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
}
