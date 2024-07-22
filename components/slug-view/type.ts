import { MenuItemI } from "@/services/menuService"

export type ItemsForOrder = {
  itemId: string | undefined
  quantity: number
  price: number | undefined
  portion?: string | undefined
  dish: string
}

export type ItemsToRender = {
  id: string
  categoryName: string
  Item?: MenuItemI[]
}
