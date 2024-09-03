import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import useMediaQuery from "@/hook/useMediaQuery"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { getRestaurantSlug } from "@/services/restaurantService"
import { OrderStatus } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { generateReceipt } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Loading from "./loader"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { useToast } from "./ui/use-toast"

interface OrderDetailsProps {
  orderId: string
  restaurantId: string
  isOpen: boolean
  onClose: () => void
  updateOrderStatus?: (id: string, status: OrderStatus) => void
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  restaurantId,
  orderId,
  isOpen,
  onClose,
  updateOrderStatus,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { server, isConnected, printOrder } = useBluetoothPrinter()
  const { toast } = useToast()
  const router = useRouter()

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => await getOrderWithItemsById(orderId, true),
  })

  const { data: restaurant, isLoading: isRestaurantNameLoading } = useQuery({
    queryKey: ["restaurant", order?.restaurantId],
    queryFn: async () =>
      await getRestaurantSlug(restaurantId || "", {
        name: true,
      }),
  })

  const handleStatusChange = useCallback(
    async (newStatus: OrderStatus) => {
      try {
        await updateOrder({ id: orderId, status: newStatus })
        updateOrderStatus?.(orderId, newStatus)
        if (!updateOrderStatus || typeof updateOrderStatus === "undefined") {
          router.refresh()
        }
      } catch (error) {
        console.error("Failed to update order status", error)
      }
    },
    [router, orderId, updateOrderStatus]
  )

  const handlePrint = async () => {
    try {
      if (!order) return
      if (!restaurant) return

      const receiptData = generateReceipt(
        restaurant.name,
        order.orderItems,
        order.total.toString(),
        order.tableNo
      )

      await printOrder(receiptData)
      await handleStatusChange("ACCEPTED")
    } catch (error) {
      console.error("Failed to print order", error)
    }
  }
  if (!orderId) return null

  const content = (
    <>
      {isLoading || isRestaurantNameLoading ? (
        <Loading />
      ) : order ? (
        <>
          <div className="mb-4 space-y-2 rounded-lg bg-gray-100 p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">
              Table Number:{" "}
              <span className="font-bold text-gray-900">{order.tableNo}</span>
            </p>
            {/* <p className="text-sm font-medium text-gray-600">
              Order Status:{" "}
              <span className="font-bold text-gray-900">{order.status}</span>
            </p> */}
            <p className="text-sm font-medium text-gray-600">
              Order Time:{" "}
              <span className="font-bold text-gray-900">
                {order.createdAt.toLocaleString()}
              </span>
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Item</TableHead>
                <TableHead>Portion</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.orderItems?.map((orderItem) => (
                <TableRow className="whitespace-nowrap">
                  <TableCell className="font-medium">
                    {orderItem.name}
                  </TableCell>
                  <TableCell>{orderItem.portion}</TableCell>
                  <TableCell>{orderItem.quantity}</TableCell>
                  <TableCell className="text-right">
                    {" "}
                    &#x20b9; {orderItem.price.toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="whitespace-nowrap">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  &#x20b9; {order?.total.toString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="flex justify-center">
            <Button
              className="mt-4 w-full max-w-[200px]"
              onClick={handlePrint}
              disabled={!isConnected}
            >
              {isConnected ? "Print" : "Printer not connected"}
            </Button>
          </div>
        </>
      ) : (
        <p>No order details found</p>
      )}
    </>
  )

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(flag) => {
          if (!flag) {
            onClose()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Order Details for &quot;{restaurant?.name}&quot;
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(flag) => {
          if (!flag) {
            onClose()
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Order Details for &quot;{restaurant?.name}&quot;
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[90vh] w-full overflow-y-auto p-4">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    )
  }
}

export default OrderDetails
