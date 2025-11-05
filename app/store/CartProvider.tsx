"use client"

import { QuantityControlAction } from "@/components/slug-view/util"
import { Cart } from "@/lib/types"
import { createContext, useContext, useState } from "react"
import { create } from "zustand"

type CartMap = {
  [key: string]: Cart
}

const generateCartKey = (item: Omit<Cart, "quantity">): string => {
  let key = `${item.id}`
  if (item.portion) key += `_${item.portion}`
  if (item.addons && item.addons.length > 0) {
    const sortedAddonIds = item.addons
      .map((addon) => addon.id)
      .sort()
      .join(",")
    key += `_${sortedAddonIds}`
  }
  return key
}

const calculateTotal = (cart: CartMap): { quantity: number; price: number } => {
  const total = Object.values(cart).reduce(
    (acc, item) => {
      acc.quantity += item.quantity
      acc.price += item.price * item.quantity
      return acc
    },
    { quantity: 0, price: 0 }
  )
  // Handle floating point precision
  total.price = parseFloat(total.price.toFixed(2))
  return total
}

const createStore = (initialCart: Cart[]) => {
  const cartMap: CartMap = initialCart.reduce((acc, item) => {
    const key = generateCartKey(item)
    acc[key] = { ...item, quantity: item.quantity, addons: item.addons || [] }
    return acc
  }, {} as CartMap)

  const initialTotal = calculateTotal(cartMap)

  return create<{
    cart: CartMap
    total: { quantity: number; price: number }
    setCart: (item: Omit<Cart, "quantity">, type: QuantityControlAction, amount?: number) => void
    removeItem: (item: Cart) => void
    clearCart: () => void
  }>((set, get) => ({
    cart: cartMap,
    total: initialTotal,
    setCart(item: Omit<Cart, "quantity">, type: QuantityControlAction, amount = 1) {
      const prevCart = get().cart
      const key = generateCartKey(item)
      const existingItem = prevCart[key]

      let newCart = { ...prevCart }
      let newTotal = { ...get().total }

      if (existingItem) {
        const newQuantity =
          existingItem.quantity + (type === QuantityControlAction.INCREMENT ? amount : -amount)

        if (newQuantity > 0) {
          newCart[key] = { ...existingItem, quantity: newQuantity }
          newTotal.price +=
            type === QuantityControlAction.INCREMENT ? item.price * amount : -item.price * amount
          newTotal.quantity += type === QuantityControlAction.INCREMENT ? amount : -amount
        } else {
          delete newCart[key]
          newTotal.price -= item.price * existingItem.quantity
          newTotal.quantity -= existingItem.quantity
        }
      } else if (type === QuantityControlAction.INCREMENT) {
        newCart[key] = { ...item, quantity: amount }
        newTotal.price += item.price * amount
        newTotal.quantity += amount
      }

      set({ cart: newCart, total: newTotal })
    },
    removeItem(item: Omit<Cart, "quantity">) {
      const prevCart = get().cart
      const key = generateCartKey(item)
      const newCart = { ...prevCart }
      const existingItem = newCart[key]

      if (existingItem) {
        const newTotal = {
          price: get().total.price - existingItem.price * existingItem.quantity,
          quantity: get().total.quantity - existingItem.quantity,
        }
        delete newCart[key]
        set({ cart: newCart, total: newTotal })
      }
    },
    clearCart() {
      set({ cart: {}, total: { quantity: 0, price: 0 } })
    },
  }))
}

const CartContext = createContext<ReturnType<typeof createStore> | null>(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}

const CartProvider = ({ cart, children }: { cart?: Cart[]; children: React.ReactNode }) => {
  const [store] = useState(() => createStore(cart || []))

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>
}

export default CartProvider
