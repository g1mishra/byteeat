"use client"

import { createContext, useContext, useState } from "react"
import { create } from "zustand"

import { Cart } from "@/lib/types"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  portion?: string
}

type CartMap = {
  [key: string]: CartItem
}

const createStore = (initialCart: Cart[]) => {
  const cartMap: CartMap = initialCart.reduce((acc, item) => {
    const key = `${item.id}${item.portion ? `-${item.portion}` : ""}`
    acc[key] = { ...item, quantity: item.quantity }
    return acc
  }, {} as CartMap)

  const calculateTotal = (cart: CartMap) => {
    const quantity = Object.values(cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    const price = Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    return { quantity, price }
  }

  const initialTotal = calculateTotal(cartMap)

  return create<{
    cart: CartMap
    total: { quantity: number; price: number }
    setCart: (item: Cart, type: "inc" | "dec") => void
    removeItem: (item: Cart) => void
    clearCart: () => void
  }>((set, get) => ({
    cart: cartMap,
    total: initialTotal,
    setCart(item: Cart, type: "inc" | "dec") {
      const prevCart = get().cart
      const key = `${item.id}${item.portion ? `-${item.portion}` : ""}`
      const existingItem = prevCart[key]

      let newCart = { ...prevCart }
      let newTotal = { ...get().total }

      if (existingItem) {
        const newQuantity = existingItem.quantity + (type === "inc" ? 1 : -1)

        if (newQuantity > 0) {
          newCart[key] = { ...existingItem, quantity: newQuantity }
          newTotal.price += type === "inc" ? item.price : -item.price
          newTotal.quantity += type === "inc" ? 1 : -1
        } else {
          delete newCart[key]
          newTotal.price -= item.price * existingItem.quantity
          newTotal.quantity -= existingItem.quantity
        }
      } else if (type === "inc") {
        newCart[key] = { ...item, quantity: 1 }
        newTotal.price += item.price
        newTotal.quantity += 1
      }

      set({ cart: newCart, total: newTotal })
    },
    removeItem(item: Cart) {
      const prevCart = get().cart
      const key = `${item.id}${item.portion ? `-${item.portion}` : ""}`
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

const CartProvider = ({
  cart,
  children,
}: {
  cart?: Cart[]
  children: React.ReactNode
}) => {
  const [store] = useState(() => createStore(cart || []))

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>
}

export default CartProvider
