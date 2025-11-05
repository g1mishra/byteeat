import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import useMediaQuery from "@/hook/useMediaQuery"
import { generateReceipt } from "@/lib/utils"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { getRestaurantSlug } from "@/services/restaurantService"
import { OrderStatus } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import React from "react"

import Loading from "./loader"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface OrderDetailsProps {
  orderId: string
  restaurantId: string
  isOpen: boolean
  onClose: () => void
  updateOrderStatus?: (id: string, status: OrderStatus) => void
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  restaurantId,
  orderId,
  isOpen,
  onClose,
  updateOrderStatus,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { isConnected, printOrder } = useBluetoothPrinter()

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderWithItemsById(orderId),
  })

  const { data: restaurant, isLoading: isRestaurantLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantSlug(restaurantId, { name: true }),
  })

  const handlePrint = async () => {
    if (!order || !restaurant) return
    const receiptData = generateReceipt(
      restaurant.name,
      order.orderItems?.map((item) => ({
        id: item?.id ?? "",
        itemId: item?.itemId ?? "",
        orderId: item?.orderId ?? "",
        portion: item?.portion ?? "",
        quantity: item?.quantity ?? 0,
        name: item?.name ?? "",
        price: item?.price ?? 0,
        addons:
          item?.addons?.map((addon) => ({
            id: addon?.id ?? "",
            name: addon?.addon?.name ?? "",
            price: addon?.addon?.price ?? 0,
          })) ?? [],
      })) ?? [],
      order.subtotal.toString(),
      order.total.toString(),
      Number(order.discount),
      order.tableNo
    )
    await printOrder(receiptData)
    await updateOrder({ id: orderId, status: "ACCEPTED" })
    updateOrderStatus?.(orderId, "ACCEPTED")
  }

  const renderOrderItem = (item: any) => (
    <React.Fragment key={item.id}>
      <TableRow>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.portion}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell className="whitespace-nowrap text-right">
          ₹ {item.totalPrice.toFixed(2)}
        </TableCell>
      </TableRow>
      {item.addons.map((addon: any) => (
        <TableRow key={addon.id} className="bg-gray-50">
          <TableCell className="pl-8 text-sm" colSpan={2}>
            {addon.addon.name}
          </TableCell>
          <TableCell className="text-sm">{addon.quantity}</TableCell>
          <TableCell className="text-right text-sm">₹ {addon.totalPrice.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  )

  const content =
    isOrderLoading || isRestaurantLoading ? (
      <Loading />
    ) : order ? (
      <>
        <div className="mb-6 space-y-2 rounded-lg bg-gray-100 p-4 shadow-sm">
          <p className="text-sm font-medium">
            Table Number: <span className="font-bold">{order.tableNo}</span>
          </p>
          <p className="text-sm font-medium">
            Order Status: <span className="font-bold">{order.status}</span>
          </p>
          <p className="text-sm font-medium">
            Order Time:{" "}
            <span className="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Portion</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{order.orderItems.map(renderOrderItem)}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell className="text-right">₹ {order.itemsTotal.toFixed(2)}</TableCell>
            </TableRow>
            {Number(order.discount) > 0 && (
              <TableRow>
                <TableCell colSpan={3}>Discount</TableCell>
                <TableCell className="text-right">₹ {Number(order.discount).toFixed(2)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">
                ₹ {Number(order.total).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="mt-6 flex justify-center">
          <Button className="w-full max-w-[200px]" onClick={handlePrint} disabled={!isConnected}>
            {isConnected ? "Print Order" : "Printer not connected"}
          </Button>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-600">No order details found</p>
    )

  const DialogComponent = isDesktop ? Dialog : Drawer
  const DialogContentComponent = isDesktop ? DialogContent : DrawerContent

  return (
    <DialogComponent open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContentComponent className={isDesktop ? "max-w-3xl" : ""} hideHandle>
        <DialogHeader>
          <DialogTitle
            className={`${
              isDesktop ? "text-2xl" : "text-xl"
            } border-b px-4 py-2 text-left font-bold`}
          >
            Order Details for &quot;{restaurant?.name}&quot;
          </DialogTitle>
        </DialogHeader>
        <ScrollArea
          className={`${
            isDesktop ? "max-h-[80vh] pr-4" : "max-h-[80vh] w-full overflow-y-auto p-4"
          }`}
        >
          {content}
        </ScrollArea>
      </DialogContentComponent>
    </DialogComponent>
  )
}

export default OrderDetails
