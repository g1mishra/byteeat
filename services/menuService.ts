"use server"

import prisma from "@/lib/prisma"

export interface MenuItemI {
  id?: number
  category: string
  dish: string
  price: number
  restaurantId: number
}

const fetchMenus = async (): Promise<MenuItemI[]> => {
  try {
    return await prisma.item.findMany()
  } catch (error) {
    throw error
  }
}

export const fetchAllCategories = async (
  restaurantId: string
): Promise<string[]> => {
  try {
    const categories = await prisma.item.findMany({
      distinct: ["category"],
      where: {
        restaurantId: parseInt(restaurantId),
      },
      select: {
        category: true,
      },
    })

    return categories.map((category) => category.category)
  } catch (error) {
    throw error
  }
}

const fetchMenu = async (menuId: number): Promise<MenuItemI | null> => {
  try {
    return await prisma.item.findUnique({
      where: {
        id: menuId,
      },
    })
  } catch (error) {
    throw error
  }
}

const addMenu = async (menuData: MenuItemI): Promise<MenuItemI> => {
  try {
    return await prisma.item.create({
      data: menuData,
    })
  } catch (error) {
    throw error
  }
}

const updateMenu = async (menuData: MenuItemI): Promise<MenuItemI> => {
  try {
    return await prisma.item.update({
      where: {
        id: menuData.id,
      },
      data: menuData,
    })
  } catch (error) {
    throw error
  }
}

const deleteMenu = async (menuId: number): Promise<void> => {
  try {
    await prisma.item.delete({
      where: {
        id: menuId,
      },
    })
  } catch (error) {
    throw error
  }
}

export { addMenu, deleteMenu, fetchMenu, fetchMenus, updateMenu }
