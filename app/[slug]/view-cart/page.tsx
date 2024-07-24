"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"

import { Cart } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useCart } from "../../store/CartProvider"

export default function ViewCart() {
  const { cart, setCart, removeItem } = useCart()((state) => state)
  const router = useRouter()

  const handleQuantityChange = (
    operation: "inc" | "dec",
    currentItem: Cart
  ) => {
    if (!currentItem) return

    setCart(
      {
        id: currentItem.id as string,
        name: currentItem.name,
        price: currentItem.price || 0,
        quantity: currentItem?.quantity || 0,
        portion: currentItem.portion || "",
      },
      operation
    )
  }

  return (
    <div className="container mx-auto grid gap-6 p-0">
      <div className="bg-primary flex items-center space-x-2">
        <Button size="sm" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>
      {cart.length === 0 ? (
        <div className="text-muted-foreground grid min-h-40 place-content-center text-center">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 px-6">
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
                      onClick={() => handleQuantityChange("dec", item)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <div>{item.quantity}</div>
                    <Button
                      size="sm"
                      onClick={() => handleQuantityChange("inc", item)}
                    >
                      +
                    </Button>
                    <Trash2
                      size={24}
                      className="ml-2 cursor-pointer text-red-500"
                      onClick={() => removeItem(item)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex w-full px-6">
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
