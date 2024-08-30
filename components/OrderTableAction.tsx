"use client"

import { printOrder, useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { getRestaurantSlug } from "@/services/restaurantService"
import { Order, OrderStatus } from "@prisma/client"
import { EyeIcon, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateReceipt } from "@/lib/utils"


const STATUSES = Object.values(OrderStatus).filter(status => status !== OrderStatus.DELIVERED)

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
      const { isConnected, server } = useBluetoothPrinter()
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
  
      const handlePrint = useCallback(
        async (orderId: string) => {
          if (!server || !isConnected) return
          try {
            const restaurantName = await getRestaurantSlug(
              rowOrder.restaurantId,
              {
                name: true,
              }
            )
            const order = await getOrderWithItemsById(orderId, true)
  
            if (!order) {
              console.error("Order not found.")
              return
            }
  
            const receiptData = generateReceipt(
              restaurantName?.name,
              order.orderItems,
              rowOrder.total?.toNumber(),
              rowOrder.tableNo
            )
  
            await printOrder(server, receiptData)
            await handleStatusChange("ACCEPTED")
          } catch (error) {
            console.error("Error:", error)
          }
        },
        [server, isConnected, rowOrder, handleStatusChange]
      )
  
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