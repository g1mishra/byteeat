"use server"

import { Item, PriceItemMap } from "@prisma/client"

import prisma from "@/lib/prisma"

import { checkAuth } from "./utils.service"

export interface MenuItemI extends Item {
  PriceItemMap?: PriceItemMapI[]
}

export interface PriceItemMapI extends Omit<PriceItemMap, "id"> {
  id?: string
}

export interface ItemCategoryI {
  id?: string
  categoryName: string
  restaurantId: string
}

const fetchMenuItem = async (menuId: string) => {
  try {
    return await prisma.item.findUnique({
      where: {
        id: menuId,
      },
      include: {
        PriceItemMap: true,
      },
    })
  } catch (error) {
    throw error
  }
}

export type MenuItemWithPriceI = MenuItemI & { PriceItemMap: PriceItemMapI[] }

const addMenuItem = async (
  menuData: Omit<MenuItemI, "id" | "position" | "isActive">
) => {
  try {
    await checkAuth("You are not authorized to add a menu item")

    return await prisma.item.create({
      data: {
        dish: menuData.dish,
        categoryId: menuData.categoryId,
        description: menuData.description,
        imgPath: menuData.imgPath,
        isVeg: menuData.isVeg,
        type: menuData.type,
      },
    })
  } catch (error) {
    throw error
  }
}

const updateMenuItem = async (
  menuData: Partial<MenuItemI>
): Promise<MenuItemI> => {
  if (!menuData.id) {
    throw new Error("Menu item id is required")
  }

  try {
    await checkAuth("You are not authorized to update this menu item")
    return await prisma.item.update({
      where: {
        id: menuData.id,
      },
      data: {
        dish: menuData.dish,
        categoryId: menuData.categoryId,
        description: menuData.description,
        imgPath: menuData.imgPath,
        isVeg: menuData.isVeg,
        type: menuData.type,
      },
    })
  } catch (error) {
    throw error
  }
}

const deleteMenuItem = async (
  menuId: string,
  categoryId: string
): Promise<void> => {
  try {
    if (!menuId) {
      throw new Error("Menu ID is required")
    }
    await checkAuth("You are not authorized to delete this menu item")
    const cat_size = await getCatIdNums(categoryId)

    await prisma.item.delete({
      where: {
        id: menuId,
      },
    })

    if (cat_size === 1) {
      await deleteCategory(categoryId)
    }
  } catch (error) {
    throw error
  }
}

const deletePriceItem = async (menuId: string): Promise<void> => {
  try {
    if (!menuId) {
      throw new Error("Menu ID is required")
    }
    await checkAuth("You are not authorized to delete this menu item")
    await prisma.priceItemMap.deleteMany({
      where: {
        itemId: menuId,
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
        restaurantId: restaurantId,
      },
    })

    return categories.map((category) => category.categoryName)
  } catch (error) {
    throw error
  }
}

const addOrFetchCategory = async (
  categoryName: string,
  restaurantId: string
) => {
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

    await checkAuth("You are not authorized to add a category")

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
  categoryId: string
): Promise<ItemCategoryI> => {
  if (!categoryName) {
    throw new Error("Category name is required")
  }

  categoryName = categoryName
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()

  try {
    await checkAuth("You are not authorized to update a category")
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
  categoryId: string
): Promise<ItemCategoryI | null> => {
  try {
    return prisma.itemCategory.findUnique({
      where: {
        id: categoryId,
      },
    })
  } catch (error) {
    throw error
  }
}

async function getCatIdNums(catId: string) {
  try {
    const res = await prisma.item.findMany({
      where: {
        categoryId: catId,
      },
    })
    return res.length
  } catch (error) {
    throw error
  }
}

const deleteCategory = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error("Menu ID is required")
    }
    await checkAuth("You are not authorized to delete this menu item")
    await prisma.itemCategory.deleteMany({
      where: {
        id: id,
      },
    })
    console.log("Deleted category")
  } catch (error) {
    throw error
  }
}

// price

const fetchPrice = async (itemId: string) => {
  try {
    return prisma.priceItemMap.findMany({
      where: {
        itemId: itemId,
      },
    })
  } catch (error) {
    throw error
  }
}

const fetchPriceMap = async (itemId: string) => {
  try {
    return prisma.priceItemMap.findMany({
      where: {
        itemId: itemId,
      },
    })
  } catch (error) {
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
          id: price.id,
        },
        data: price,
      })
    })
    return await prisma.$transaction(operations)
  } catch (error) {
    throw error
  }
}

const deleteItemPrice = async (priceIds: string[]) => {
  try {
    return await prisma.priceItemMap.deleteMany({
      where: {
        id: {
          in: priceIds,
        },
      },
    })
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
  updateItemPrice,
  fetchPrice,
  fetchPriceMap,
  updateMenuItem,
  updateCategory,
  deletePriceItem,
  deleteItemPrice,
  getCatIdNums,
}
