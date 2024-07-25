"use server"

import { MenuFormValues } from "@/components/manage/create-menu-item"

import {
  MenuItemI,
  PriceItemMapI,
  addItemPrice,
  addMenuItem,
  addOrFetchCategory,
  deleteItemPrice,
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
  oldData: MenuFormValues & MenuItemI,
  newData: MenuFormValues
): Promise<void> => {
  const data = {
    ...oldData,
    ...newData,
  }
  try {
    if (!data.id) throw new Error("Menu item id is required")
    let categoryId = data.categoryId

    await updateCategory(data.category, categoryId)

    await updateMenuItem({
      id: data.id,
      dish: data.dish,
      categoryId: categoryId,
      description: data.description,
      imgPath: data.imgPath,
      foodOrBar: data.foodOrBar,
      isVeg: data.isVeg,
    })

    const pricesToBeAdded: PriceItemMapI[] = []
    const pricesToBeUpdate: Partial<PriceItemMapI>[] = []
    const pricesToBeDelete: string[] = []

    newData?.PriceItemMap?.forEach((priceObj) => {
      if (priceObj.id) {
        pricesToBeUpdate.push(priceObj)
      } else {
        pricesToBeAdded.push(priceObj as PriceItemMapI)
      }
    })

    oldData?.PriceItemMap?.forEach((priceObj) => {
      if (!data.PriceItemMap.find((item) => item.id === priceObj.id)) {
        pricesToBeDelete.push(priceObj.id as string)
      }
    })

    if (pricesToBeUpdate.length) {
      await updateItemPrice(pricesToBeUpdate)
    }

    if (pricesToBeAdded.length) {
      await addItemPrice(pricesToBeAdded)
    } 

    if (pricesToBeDelete.length) {
      await deleteItemPrice(pricesToBeDelete)
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

export { addMenuItemHelper, deleteMenuItemHelper, updateMenuItemHelper }

