"use server"

import { MenuFormValues } from "@/components/manage/create-menu"

import {
  MenuItemI,
  PriceItemMapI,
  addItemPrice,
  addMenuItem,
  addOrFetchCategory,
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
    })

    const payload = data.priceMap.map((price) => ({
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
  console.log(
    "data",
    data,
    data.id,
    data.categoryId,
    data.category,
    data.priceMap
  )
  try {
    if (!data.id) throw new Error("Menu item id is required")
    let categoryId = data.categoryId

    await updateCategory(data.category, categoryId)

    const menuResp = await updateMenuItem({
      ...data,
      categoryId,
    })

    const payload: Partial<PriceItemMapI>[] = data?.priceMap?.map((price) => ({
      price: price.price,
      portion: price.portion || "",
      id : price.id
    }))

    if (payload) {
      await updateItemPrice(payload)
    }
  } catch (error) {
    throw error
  }
}

export { addMenuItemHelper, updateMenuItemHelper }
