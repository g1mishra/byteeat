"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useCart } from "../../store/CartProvider"

export default function ViewCart() {
  const { cart, setCart } = useCart()((state) => state)
  const router = useRouter()

  const removeFromCart = (item: any) => {
    setCart(
      cart.filter((_item) => {
        if (_item?.portion || item?.portion) {
          return (
            _item.id !== item.id ||
            _item.portion?.toLowerCase() !== item.portion?.toLowerCase()
          )
        }
        return _item.id !== item.id
      })
    )
  }

  const addToCart = (type: "inc" | "dec", _item: any) => {
    const item = cart.find(
      (item) =>
        item.id === _item?.id &&
        (item.portion || null) === (_item.portion || null)
    )
    const newCart = item
      ? cart.map((cartItem) =>
          cartItem.id === item.id &&
          (cartItem.portion || null) === (item.portion || null)
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (type === "inc" ? 1 : -1),
              }
            : cartItem
        )
      : [
          ...cart,
          {
            id: _item?.id,
            name: _item?.dish,
            price: _item.price || 0,
            quantity: 1,
            portion: _item.portion || null,
          },
        ]
    setCart(newCart)
  }

  return (
    <div className="container mx-auto grid gap-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button size="default" variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
      {cart.length === 0 ? (
        <div className="text-muted-foreground min-h-40 text-center">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-background grid gap-6 overflow-hidden rounded-lg border shadow-lg"
            >
              <div className="flex flex-col justify-between p-6">
                <h3 className="mb-2 text-2xl font-bold">
                  {item.name} - ({item?.portion})
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">₹{item.price}</div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => addToCart("dec", item)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <div>{item.quantity}</div>
                    <Button
                      size="sm"
                      onClick={() =>
                        addToCart("inc", { ...item, price: item.price })
                      }
                    >
                      +
                    </Button>
                    <Trash2
                      size={24}
                      className="ml-2 cursor-pointer text-red-500"
                      onClick={() => removeFromCart(item)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex w-full">
        <div className="bg-background w-full rounded-lg p-6 shadow-lg md:p-8">
          <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
          <div className="mb-2 flex items-center justify-between">
            <div>Subtotal</div>
            <div>
              ₹
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div>Shipping</div>
            <div>Free</div>
          </div>
          <Separator className="my-4" />
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg font-medium">
              ₹
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </div>
          </div>
          <Button size="lg" className="w-full" disabled={cart.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
