"use server"

import prisma from "@/lib/prisma"

export interface MenuItemI {
  PriceItemMap?: PriceItemMapI[]
  id?: number
  dish: string
  categoryId: number
  description?: string
  imgPath?: string
  foodOrBar: boolean
  isVeg?: boolean
}

export interface PriceItemMapI {
  id?: number
  price: number
  portion: string
  itemId: number
}

export interface ItemCategoryI {
  id?: number
  categoryName: string
  restaurantId: number
}

const fetchMenuItems = async (): Promise<MenuItemI[]> => {
  try {
    return await prisma.item.findMany()
  } catch (error) {
    throw error
  }
}

const fetchMenuItem = async (menuId: number): Promise<MenuItemI | null> => {
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

const addMenuItem = async (menuData: MenuItemI): Promise<MenuItemI> => {
  try {
    return await prisma.item.create({
      data: {
        dish: menuData.dish,
        categoryId: menuData.categoryId,
        description: menuData.description,
        imgPath: menuData.imgPath,
        foodOrBar: menuData.foodOrBar,
        isVeg: menuData.isVeg,
      },
    })
  } catch (error) {
    throw error
  }
}

const updateMenuItem = async (menuData: MenuItemI): Promise<MenuItemI> => {
  try {
    return await prisma.item.update({
      where: {
        id: menuData.id,
      },
      data: {
        dish: menuData.dish,
        categoryId: menuData.categoryId,
        description: menuData.description,
        imgPath: menuData.imgPath,
        foodOrBar: menuData.foodOrBar,
        isVeg: menuData.isVeg,
      },
    })
  } catch (error) {
    throw error
  }
}

const deleteMenuItem = async (menuId: number): Promise<void> => {
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

// category
const fetchAllCategories = async (restaurantId: string): Promise<string[]> => {
  try {
    const categories = await prisma.itemCategory.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
      },
    })

    return categories.map((category) => category.categoryName)
  } catch (error) {
    throw error
  }
}

const addOrFetchCategory = async (
  categoryName: string,
  restaurantId: number
): Promise<ItemCategoryI> => {
  if (!categoryName) {
    throw new Error("Category name is required")
  }

  categoryName = categoryName
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()

  try {
    const category = await prisma.itemCategory.findFirst({
      where: {
        categoryName,
        restaurantId,
      },
    })

    if (category) {
      return category
    }

    return await prisma.itemCategory.create({
      data: {
        categoryName,
        restaurantId,
      },
    })
  } catch (error) {
    throw error
  }
}

const updateCategory = async (
  categoryName: string,
  categoryId: number
): Promise<ItemCategoryI> => {
  if (!categoryName) {
    throw new Error("Category name is required")
  }

  categoryName = categoryName
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()

  try {
    return await prisma.itemCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        categoryName,
      },
    })
  } catch (error) {
    throw error
  }
}

const fetchCategoryById = async (
  categoryId: number
): Promise<ItemCategoryI | null> => {
  try {
    return prisma.itemCategory.findUnique({
      where: {
        id: Number(categoryId),
      },
    })
  } catch (error) {
    throw error
  }
}

// price

const fetchPrice = async (itemId: number) => {
  try {
    return prisma.priceItemMap.findMany({
      where: {
        itemId: Number(itemId)
      }
    })
  } catch(error){
    throw error
  }
}

const fetchPriceMap = async (itemId: number) => {
  try {
    return prisma.priceItemMap.findMany({
      where: {
        itemId: Number(itemId)
      }
    })
  } catch(error){
    throw error
  }
}

const addItemPrice = async (priceData: PriceItemMapI[]) => {
  try {
    return await prisma.priceItemMap.createMany({
      data: priceData,
      skipDuplicates: true,
    })
  } catch (error) {
    throw error
  }
}

const updateItemPrice = async (priceData: Partial<PriceItemMapI>[]) => {
  try {
    const operations = priceData.map((price) => {
      return prisma.priceItemMap.update({
        where: {
          id: price.id
        },
        data: price,
      })
    })
    return await prisma.$transaction(operations)
  } catch (error) {
    throw error
  }
}

export {
  addItemPrice,
  addMenuItem,
  addOrFetchCategory,
  deleteMenuItem,
  fetchAllCategories,
  fetchCategoryById,
  fetchMenuItem,
  fetchMenuItems,
  updateItemPrice,
  fetchPrice,
  fetchPriceMap,
  updateMenuItem,
  updateCategory,
}
