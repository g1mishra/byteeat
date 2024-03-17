"use server"

import prisma from "@/lib/prisma"

import { MenuItemI } from "./menuService"

interface RestaurantI {
  id?: number
  name: string
  tableSize: number
  address: string
}

const fetchRestaurants = async (): Promise<RestaurantI[]> => {
  try {
    return await prisma.restaurant.findMany()
  } catch (error) {
    throw error
  }
}

const fetchRestaurant = async (
  restaurantId: number
): Promise<
  | (RestaurantI & {
      menus: MenuItemI[]
    })
  | null
> => {
  try {
    return await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      include: {
        menus: true,
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
  updateRestaurant
}

