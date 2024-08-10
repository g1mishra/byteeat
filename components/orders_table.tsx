"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { Order, OrderItem, OrderStatus } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRestaurantSlug } from "@/services/restaurantService"

interface DataTableProps {
  columns: { header: string; accessor: keyof OrderI }[]
  data: Order[]
  polling?: boolean
}
interface ReceiptProps {
  slug: string | undefined;
  orderItems: OrderItem[]; // Ensure this is an array
}

const statuses = Object.values(OrderStatus)


function receipt(slug: string | undefined, orderItems: OrderItem[], total: number, tableNo: number) {

  let result = ''
  result += '--------------------------------\n'
  result += `\n\n${slug}\n\n`.replace('-',' ').toUpperCase()

  result += '--------------------------------\n'
  result += `Dine in: ${tableNo}\n`
  
  result += `Total: Rs. ${total}\n`
  result += '--------------------------------\n'
  // Add each order item
  orderItems?.forEach((orderItem: any) => {
    result += `${orderItem.name} ${orderItem.portion} ${orderItem.quantity}\n`;
    result += `Rs. ${orderItem.price.toFixed(2)}\n\n`
  });

  result += '\n\n'
  result += '--------------------------------\n'
  result += '\n\n\n\n'

  console.log(result,"here")
  return result;
}

function Actions({ rowOrder, server}: { rowOrder: Order, server: any }) {
  const router = useRouter()


  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrder({
        id: rowOrder.id,
        status: newStatus,
      })
      console.log("Order status updated successfully", updatedOrder)
      router.refresh()
    } catch (error) {
      console.error("Failed to update order status", error)
    }
  }

  const handlePrint = async (orderId: string, restroId: string, tableNo: number) => {
    console.log(server)
    if (!server) return;
   
    const restauntName: {slug: string} | null = await getRestaurantSlug(restroId)
    const order: any | null = await getOrderWithItemsById(orderId, true);

    let total = 0;
    order.orderItems?.forEach((orderItem: any) => {
      total += orderItem.price * orderItem.quantity
    });

    console.log(total)
    console.log(order.orderItems)
    console.log(tableNo)

    // Replace with your service and characteristic UUIDs
    const PRINT_SERVICE_UUID: string = '000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase();
    const PRINT_CHARACTERISTIC_UUID: string = '00002AF1-0000-1000-8000-00805F9B34FB'.toLowerCase();
    server.getPrimaryService(PRINT_SERVICE_UUID)
        .then((service: any) => {
            return service.getCharacteristic(PRINT_CHARACTERISTIC_UUID);
        })
        .then((characteristic: any) => {
            const data: Uint8Array = new Uint8Array([

                ...new TextEncoder().encode(receipt(restauntName?.slug, order.orderItems, total, tableNo)),
            ]);
            return characteristic.writeValue(data);
        })
        .then(() => {
            console.log('Print command sent successfully.');
            handleStatusChange('ACCEPTED')
        })
        .catch((error: any) => {
            console.error('Error:', error);
          });
  };


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
        {statuses.map((curr) =>
          curr !== rowOrder.status ? (
            <DropdownMenuItem
              key={curr}
              onClick={() => {
                handleStatusChange(curr)
              }}
            >
              {curr}
            </DropdownMenuItem>
          ) : null
        )}
        <DropdownMenuSeparator />
        <Link
          href={`/manage/restaurant/${rowOrder.restaurantId}/orders/${rowOrder.id}`}
        >
          <DropdownMenuItem>Open order</DropdownMenuItem>
        </Link>
        
        <Button
          onClick={() => handlePrint(rowOrder.id, rowOrder.restaurantId, rowOrder.tableNo)} className="bg-white text-black"
        >
          <DropdownMenuItem>Print order</DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface OrderI extends Order {
  action: string
}

export const dcolumns: {
  header: string
  accessor: keyof OrderI
}[] = [
  { header: "ID", accessor: "id" },
  { header: "Amount", accessor: "total" },
  { header: "Table Number", accessor: "tableNo" },
  { header: "Order Status", accessor: "status" },
  { header: "Date", accessor: "createdAt" },
  { header: "Actions", accessor: "action" },
]

export function DataTable({ columns, data, polling = false }: DataTableProps) {
  const [filter, setFilter] = React.useState<string>("")
  const [connect, setConnect] = React.useState<boolean>(false)
  const [server,setServer] = React.useState<any>(null)
  const router = useRouter()
  const handleRequestDevice = async (): Promise<void> => {
    try {
        const selectedDevice: any = await (navigator as any).bluetooth.requestDevice({
            filters: [{ services: ['000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase()] }],
            optionalServices: ['000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase()]
        });

        const gattServer: any = await selectedDevice.gatt.connect();

        if(gattServer){
        setServer(gattServer);
        setConnect(true);
        console.log('Connected to GATT server:', gattServer);
        }

        // Handle the gattServer as needed
       
        
    } catch (error) {
        console.error('Error:', error);
        setConnect(false); // Ensure `setConnect` is defined in your scope
    }
};
  

  useEffect(() => {
    if (polling) {
      const interval = setInterval(() => {
        router.refresh()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [polling, router])

  const filteredData = filter
    ? data.filter((order) => order.status === filter)
    : data

  return (
    <div className="w-full rounded-md border p-4">
      <Button onClick={handleRequestDevice}>
        {connect ? "Connected ✅" : "Connect to Printer"}
      </Button>
      <div className="flex flex-col items-start py-4 sm:flex-row sm:items-center">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-md border p-2 sm:max-w-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor as string}
                  className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.header}
                </th>
              ))}
              <th className="bg-gray-50 px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.length > 0 ? (
              filteredData.map((order) => (
                <tr key={order.id}>
                  {columns.map((column) => (
                    <td
                      key={column.accessor as string}
                      className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                    >
                      {column.accessor === "action" ? (
                        <Actions rowOrder={order} server={server}/>
                      ) : (
                        String(order[column.accessor])
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="block sm:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((order) => (
            <div
              key={order.id}
              className="mb-4 rounded-lg border p-4 shadow-sm"
            >
              {columns.map((column) => (
                <div key={column.accessor as string} className="mb-2">
                  <span className="font-semibold">{column.header}: </span>
                  {column.accessor === "action" ? (
                    <Actions rowOrder={order} server={server}/>
                  ) : (
                    String(order[column.accessor])
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="h-24 text-center">No results.</div>
        )}
      </div>
    </div>
  )
}
