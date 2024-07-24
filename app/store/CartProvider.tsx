"use client"

import { createContext, useContext, useState } from "react"
import { create } from "zustand"

import { Cart } from "@/lib/types"

const createStore = (cart: Cart[]) =>
  create<{
    cart: Cart[]
    setCart: (cart: Cart, type: "inc" | "dec") => void
    removeItem: (cart: Cart) => void
    clearCart: () => void
  }>((set, get) => ({
    cart,
    removeItem(item: Cart) {
      const prevCart = get().cart
      const newCart = prevCart.filter(
        (cartItem) =>
          cartItem.id !== item.id ||
          (cartItem?.portion?.toLowerCase() || null) !==
            (item?.portion?.toLowerCase() || null)
      )
      set({ cart: newCart })
    },
    setCart(item: Cart, type: "inc" | "dec") {
      const prevCart = get().cart
      const _item = prevCart.find(
        (cartItem) =>
          item.id === cartItem?.id &&
          (item.portion || null) === (cartItem?.portion || null)
      )

      const newCart = _item
        ? prevCart.map((cartItem) =>
            cartItem.id === _item.id &&
            (cartItem.portion || null) === (_item.portion || null)
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + (type === "inc" ? 1 : -1),
                }
              : cartItem
          )
        : [
            ...prevCart,
            {
              id: item?.id,
              name: item?.name,
              price: item.price || 0,
              quantity: 1,
              portion: item.portion || "",
            },
          ]

      set({ cart: newCart })
    },
    clearCart() {
      set({ cart: [] })
    },
  }))

const CartContext = createContext<ReturnType<typeof createStore> | null>(null)

export const useCart = () => {
  if (!CartContext)
    throw new Error("useCart must be used within a CartProvider")
  return useContext(CartContext)!
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
