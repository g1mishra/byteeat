import { getOrderWithItemsById } from "services/order.services"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function OrderTable({
  params,
}: {
  params: { restroId: string; orderId: string }
}) {
  const order = await getOrderWithItemsById(params.orderId, true)

  console.log(order)
  return (
    <div>
      <h1>Order Details</h1>
      <Table>
        <TableCaption>Order Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Item</TableHead>
            <TableHead>Portion</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order?.orderItems?.map((orderItem) => (
            <TableRow>
              <TableCell className="font-medium">{orderItem.item}</TableCell>
              <TableCell>{orderItem.portion}</TableCell>
              <TableCell>{orderItem.quantity}</TableCell>
              <TableCell className="text-right">
                {" "}
                &#x20b9; {orderItem.price}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">
              &#x20b9; {order?.total}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default OrderTable
