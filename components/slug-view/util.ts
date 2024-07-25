import { MouseEvent } from "react"
import { MenuItemI } from "@/services/menuService"

import { Cart } from "@/lib/types"

export const addItemToCart =
  (item: MenuItemI, setCart: (item: Cart, operation: "inc" | "dec") => void) =>
  (e: MouseEvent<HTMLElement>) => {
    if (item.PriceItemMap && item.PriceItemMap.length > 1) {
      console.log("Multiple prices")
      return
    }
    e.preventDefault()
    setCart(
      {
        id: item.id as string,
        name: item.dish as string,
        price: item.PriceItemMap?.[0].price || 0,
        quantity: 1,
        portion: item.PriceItemMap?.[0].portion || "",
      },
      "inc"
    )
  }

export const changeItemQuantity =
  (
    item: MenuItemI,
    currentItem: Cart | undefined,
    setCart: (item: Cart, operation: "inc" | "dec") => void
  ) =>
  (e: MouseEvent<HTMLElement>, operation: "inc" | "dec") => {
    if (item.PriceItemMap && item.PriceItemMap.length > 1) {
      console.log("Multiple prices")
      return
    }
    e.preventDefault()
    if (!currentItem) return

    setCart(
      {
        id: item.id as string,
        name: item.dish,
        price: item.PriceItemMap?.[0].price || 0,
        quantity: currentItem?.quantity || 0,
        portion: item.PriceItemMap?.[0].portion || "",
      },
      operation
    )
  }
