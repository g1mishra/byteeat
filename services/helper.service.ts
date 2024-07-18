"use server"

import { MenuFormValues } from "@/components/manage/create-menu-item"

import {
  MenuItemI,
  PriceItemMapI,
  addItemPrice,
  addMenuItem,
  addOrFetchCategory,
  deleteMenuItem,
  deletePriceItem,
  updateCategory,
  updateItemPrice,
  updateMenuItem,
} from "./menuService"

const addMenuItemHelper = async (
  data: MenuFormValues,
  restaurantId: string
): Promise<void> => {
  try {
    const categoryResp = await addOrFetchCategory(data.category, restaurantId)
    const menuResp = await addMenuItem({
      ...data,
      categoryId: categoryResp.id as string,
      PriceItemMap: [],
    })

    const payload = data.PriceItemMap.map((price) => ({
      price: price.price,
      portion: price.portion || "",
      itemId: menuResp.id,
    }))
    await addItemPrice(payload)
  } catch (error) {
    throw error
  }
}

// update

const updateMenuItemHelper = async (
  data: MenuFormValues & MenuItemI
): Promise<void> => {
  try {
    if (!data.id) throw new Error("Menu item id is required")
    let categoryId = data.categoryId

    await updateCategory(data.category, categoryId)

    await updateMenuItem({
      ...data,
      categoryId,
    })

    const pricesToBeAdded: PriceItemMapI[] = []
    const pricesToBeUpdate: Partial<PriceItemMapI>[] = []

    data?.PriceItemMap?.forEach((priceObj) => {
      if (priceObj.id) {
        pricesToBeUpdate.push(priceObj)
      } else {
        pricesToBeAdded.push(priceObj as PriceItemMapI)
      }
    })

    if (pricesToBeUpdate.length) {
      await updateItemPrice(pricesToBeUpdate)
    }

    if (pricesToBeAdded.length) {
      addItemPrice(pricesToBeAdded)
    }
  } catch (error) {
    throw error
  }
}

const deleteMenuItemHelper = async (
  itemId: any,
  categoryId: any
): Promise<void> => {
  try {
    await deletePriceItem(itemId)
    await deleteMenuItem(itemId, categoryId)
  } catch (error) {
    throw error
  }
}

export { addMenuItemHelper, updateMenuItemHelper, deleteMenuItemHelper }
