"use server"

import prisma from "@/lib/prisma"

export interface MenuItemI {
  id?: number
  // category: string
  dish: string
  // price: number
  restaurantId: number
  categoryId: number,
  description?: string
  imgPath?: string
  foodOrBar: string
  vegOrNonVeg?: string
}

export interface PriceItemMapI {
  id? : number,
  price: number
  portion: string
  itemId: number
}

export interface ItemCategoryI {
  id?: number,
  categoryName: string
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
    const categories = await prisma.itemCategory.findMany({
      //distinct: ["category"],
      where: {
        restaurantId: parseInt(restaurantId),
      }
    })

    return categories.map((category) => category.categoryName)
  } catch (error) {
    throw error
  }
}

export const fetchCategory = async (categoryId: number): Promise<ItemCategoryI | null>=> {
    try{
      return prisma.itemCategory.findUnique({
        where: {
          id: Number(categoryId)
        }
      })
    } 
    catch (error) {
      throw error
    }
}

const fetchMenu = async (menuId: number): Promise<MenuItemI | null> => {
  try {
    return await prisma.item.findUnique({
      where: {
        id: Number(menuId),
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

const addPrice = async (priceData: PriceItemMapI) : Promise<PriceItemMapI> => {

  try {
    return await prisma.priceItemMap.create({
      data: priceData
    })

  } catch (error){
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


const updatePrice = async (priceData: PriceItemMapI): Promise<PriceItemMapI> => {
  try {
    return await prisma.priceItemMap.update({
      where: {
        id: priceData.id,
      },
      data: priceData,
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
