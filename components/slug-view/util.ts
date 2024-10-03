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



// Move arraysEqual outside the component
export const addonsArraysEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)
  if (set1.size !== set2.size) return false
  for (let value of set1) {
    if (!set2.has(value)) return false
  }
  return true
}