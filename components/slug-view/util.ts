import { Cart } from "@/lib/types"
import { useCart } from "@/app/store/CartProvider"

export enum QuantityControlAction {
  INCREMENT = "increment",
  DECREMENT = "decrement",
}

export function changeItemQuantity(
  item: Omit<Cart, "quantity">,
  setCart: (item: Omit<Cart, "quantity">, operation: QuantityControlAction, amount?: number) => void
) {
  return (operation: QuantityControlAction, amount?: number) => {
    setCart(item, operation, amount || 1)
  }
}

// TODO: to direct decrement if only one keys in cart, for one item, we can return the { itemId: [keys] }
// and then in the menu item we can check if the keys is 1, then we can directly decrement the quantity
// by using the key bcs we dont need to call the useCart() to get the state in the menu-item component
// for better performance and less computation
export function useTotalQty(): { [key: string]: number } {
  return useCart()((state) => {
    return Object.entries(state.cart).reduce((acc, [key, item]) => {
      const [itemId] = key.split("_")
      if (!acc[itemId]) {
        acc[itemId] = 0
      }
      acc[itemId] += item.quantity
      return acc
    }, {} as { [key: string]: number })
  })
}
