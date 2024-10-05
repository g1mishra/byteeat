"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { addOrderItems, createOrder } from "@/services/order.services"
import { getRestaurantIdBySlug } from "@/services/restaurantService"
import { OrderType } from "@prisma/client"
import { ArrowLeft } from "lucide-react"

import { Cart } from "@/lib/types"
import { getBasePath, getPathWithQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import QuantityActionButton from "@/components/QuantityActionBtn"
import { QuantityControlAction } from "@/components/slug-view/util"

import { useCart } from "../../../store/CartProvider"

const CheckoutDialog = dynamic(() => import("@/components/CheckoutModal"), {
  ssr: false,
})

export default function ViewCart() {
  const { cart, total, setCart, removeItem, clearCart } = useCart()((state) => state)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get("tableNumber")

  const { toast } = useToast()

  const handleQuantityChange = (operation: QuantityControlAction, currentItem: Cart) => {
    if (!currentItem) return

    setCart(
      {
        id: currentItem.id as string,
        name: currentItem.name,
        price: currentItem.price || 0,
        portion: currentItem.portion || "",
        addons: currentItem.addons || [],
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
      const resp = await createOrder(
        restoId.id,
        Number(table),
        total?.price,
        OrderType.QR,
        "PENDING",
        total?.price,
        0
      )
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
          router.push(`/orders?orderId=${resp.id}`)
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
          onClick={() =>
            router.push(
              `${getBasePath(params?.slug as string)}${
                tableNumber ? `?tableNumber=${tableNumber}` : ""
              }`
            )
          }
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
              className="bg-background grid overflow-hidden rounded-lg drop-shadow"
            >
              <div className="flex justify-between p-4">
                <div className="flex items-start">
                  <div>
                    <h3 className="text-base font-bold">{item.name}</h3>
                    <p className="text-base font-semibold">₹{item.price}</p>
                    <p className="text-sm text-gray-600">
                      {item.portion}
                      {item.addons && item.addons.length > 0
                        ? `, ${item.addons.map((addon) => addon.name).join(", ")}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <QuantityActionButton
                    buttonSize="compact"
                    currentValue={item.quantity}
                    onAction={(operation) => handleQuantityChange(operation, item)}
                  />
                  <span className="mt-2 text-base font-bold">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {Object.values(cart).length > 0 && (
        <div className="my-4 flex w-full px-6">
          <div className="bg-background w-full rounded-lg p-4 drop-shadow md:p-6">
            <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
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
              <div className="text-base font-medium">Total</div>
              <div className="text-base font-medium">₹{total?.price?.toFixed(2)}</div>
            </div>
            <Button size="lg" className="w-full" onClick={() => setShowCheckoutDialog(true)}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
      {Object.values(cart).length === 0 && (
        <div className="flex w-full justify-center">
          <Link
            href={`${getBasePath(params?.slug as string)}${
              tableNumber ? `?tableNumber=${tableNumber}` : ""
            }`}
          >
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      )}
      {showCheckoutDialog ? (
        <CheckoutDialog
          isOpen={showCheckoutDialog}
          setIsOpen={setShowCheckoutDialog}
          onSubmit={handleCheckout}
        />
      ) : null}
    </div>
  )
}
