"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { addOrderItems, createOrder } from "@/services/order.services"
import { getRestaurantIdBySlug } from "@/services/restaurantService"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"

import { Cart } from "@/lib/types"
import { getPathWithQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import CheckoutDialog from "@/components/CheckoutModal"

import { useCart } from "../../store/CartProvider"

export default function ViewCart() {
  const { cart, total, setCart, removeItem, clearCart } = useCart()(
    (state) => state
  )
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const router = useRouter()
  const params = useParams()

  const { toast } = useToast()

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

  const handleCheckout = async ({
    name,
    phone,
    table,
  }: {
    name: string
    phone: string
    table: string
  }) => {
    try {
      const restoId = await getRestaurantIdBySlug(params?.slug as string)
      if (!restoId) {
        return {
          success: false,
        }
      }
      const resp = await createOrder(restoId.id, Number(table), total?.price)
      if (!resp || !resp.id) {
        return {
          success: false,
        }
      }
      const orderItemResp = await addOrderItems(resp.id, Object.values(cart))
      if (orderItemResp.count === 0) {
        return {
          success: false,
        }
      }
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      })
      return {
        success: true,
        callBack() {
          setShowCheckoutDialog(false)
          router.push(`/${params?.slug}/orders?orderId=${resp.id}`)
          setTimeout(() => {
            clearCart()
          }, 1000)
        },
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Failed to place order",
        description: "Something went wrong. Please try again later.",
      })
      return {
        success: false,
      }
    }
  }

  return (
    <div className="container mx-auto grid gap-6 p-0">
      <div className="bg-primary flex h-14 items-center overflow-hidden">
        <Button
          className="bg-primary z-10 shrink-0"
          size="sm"
          onClick={() => router.push(getPathWithQuery(`/${params?.slug}`))}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="-ml-14 flex-1 overflow-hidden text-center text-xl font-bold text-white">
          Your Cart
        </h1>
      </div>
      {Object.values(cart).length === 0 ? (
        <div className="text-muted-foreground grid min-h-40 place-content-center text-center">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-4 px-6">
          {Object.values(cart).map((item) => (
            <div
              key={item.id}
              className="bg-background grid overflow-hidden rounded-lg border shadow-lg"
            >
              <div className="flex flex-col justify-between p-4">
                <h3 className="mb-1 text-lg font-bold">
                  {item.portion ? `${item.name} - ${item.portion}` : item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">₹{item.price}</div>
                  <div className="flex items-center">
                    <div className="bg-secondary text-primary flex items-center space-x-2 rounded-lg border">
                      <button
                        className="px-3 py-2"
                        onClick={() => handleQuantityChange("dec", item)}
                        disabled={item.quantity === 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-2"
                        onClick={() => handleQuantityChange("inc", item)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <Trash2
                      size={20}
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
      {Object.values(cart).length > 0 && (
        <div className="mt-8 flex w-full px-6">
          <div className="bg-background w-full rounded-lg p-6 shadow-lg md:p-8">
            <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
            <div className="mb-2 flex items-center justify-between">
              <div>Subtotal</div>
              <div>₹{total?.price?.toFixed(2)}</div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div>Charges</div>
              <div>N/A</div>
            </div>
            <Separator className="my-4" />
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium">Total</div>
              <div className="text-lg font-medium">
                ₹{total?.price?.toFixed(2)}
              </div>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowCheckoutDialog(true)}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
      {Object.values(cart).length === 0 && (
        <div className="flex w-full justify-center">
          <Link href={getPathWithQuery(`/${params?.slug}`)}>
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      )}
      {showCheckoutDialog ? <CheckoutDialog onSubmit={handleCheckout} /> : null}
    </div>
  )
}
