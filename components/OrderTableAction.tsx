"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { getRestaurantSlug } from "@/services/restaurantService"
import { Order, OrderStatus } from "@prisma/client"
import { EyeIcon, MoreHorizontal } from "lucide-react"

import { generateReceipt } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useToast } from "./ui/use-toast"

const STATUSES = Object.values(OrderStatus).filter(
  (status) => status !== OrderStatus.DELIVERED
)

const OrderTableAction = React.memo(
  ({
    rowOrder,
    updateOrderStatus,
    onOpenOrderDetails,
  }: {
    rowOrder: Order
    updateOrderStatus?: (id: string, status: OrderStatus) => void
    onOpenOrderDetails: () => void
  }) => {
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, server, printOrder } = useBluetoothPrinter()

    const handleStatusChange = useCallback(
      async (newStatus: OrderStatus) => {
        try {
          await updateOrder({ id: rowOrder.id, status: newStatus })
          updateOrderStatus?.(rowOrder.id, newStatus)
          if (!updateOrderStatus || typeof updateOrderStatus === "undefined") {
            router.refresh()
          }
        } catch (error) {
          console.error("Failed to update order status", error)
        }
      },
      [router, rowOrder.id, updateOrderStatus]
    )

    const handlePrint = async (orderId: string) => {
      try {
        const restaurantName = await getRestaurantSlug(rowOrder.restaurantId, {
          name: true,
        })
        const order = await getOrderWithItemsById(orderId, true)

        if (!order) {
          console.error("Order not found.")
          return
        }

        const receiptData = generateReceipt(
          restaurantName?.name,
          order.orderItems,
          rowOrder.total?.toString() || "0",
          rowOrder.tableNo
        )

        await printOrder(receiptData)
        await handleStatusChange("ACCEPTED")
      } catch (error) {
        console.error("Error:", error)
      }
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Change status</DropdownMenuLabel>
          {STATUSES.filter((status) => status !== rowOrder.status).map(
            (status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </DropdownMenuItem>
            )
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenOrderDetails}>
            View Details
            <EyeIcon className="ml-2 size-4" />
          </DropdownMenuItem>

          {server ? (
            <DropdownMenuItem onClick={() => handlePrint(rowOrder.id)}>
              Print order
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

OrderTableAction.displayName = "OrderTableAction"

export default OrderTableAction
