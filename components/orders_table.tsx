"use client"

import React, { useCallback, useState } from "react"
import Link from "next/link"
import { getOrderWithItemsById, updateOrder } from "@/services/order.services"
import { getRestaurantSlug } from "@/services/restaurantService"
import { Order, OrderStatus } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"

import { cn, generateReceipt, utcToIst } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface DataTableProps {
  columns: { header: string; accessor: keyof OrderI }[]
  data: Order[]
  updateOrderStatus?: (id: string, status: OrderStatus) => void
}

interface OrderI extends Order {
  action: string
}

const STATUSES = Object.values(OrderStatus)
const PRINT_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb"
const PRINT_CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb"

const Actions = React.memo(
  ({
    rowOrder,
    server,
    updateOrderStatus,
  }: {
    rowOrder: Order
    server: any
    updateOrderStatus?: (id: string, status: OrderStatus) => void
  }) => {
    const router = useRouter()
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

    const handlePrint = useCallback(async () => {
      if (!server) return

      try {
        const restaurantName = await getRestaurantSlug(rowOrder.restaurantId)
        const order = await getOrderWithItemsById(rowOrder.id, true)

        if (!order) {
          console.error("Order not found.")
          return
        }

        const total =
          order.orderItems?.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          ) || 0

        const service = await server.getPrimaryService(PRINT_SERVICE_UUID)
        const characteristic = await service.getCharacteristic(
          PRINT_CHARACTERISTIC_UUID
        )

        const receiptData = generateReceipt(
          restaurantName?.slug,
          order.orderItems,
          total,
          rowOrder.tableNo
        )
        await characteristic.writeValue(new TextEncoder().encode(receiptData))

        console.log("Print command sent successfully.")
        handleStatusChange("ACCEPTED")
      } catch (error) {
        console.error("Error:", error)
      }
    }, [server, rowOrder, handleStatusChange])

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
          <Link
            href={`/manage/restaurant/${rowOrder.restaurantId}/orders/${rowOrder.id}`}
          >
            <DropdownMenuItem>Open order</DropdownMenuItem>
          </Link>
          {server ? (
            <DropdownMenuItem onClick={handlePrint}>
              Print order
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

Actions.displayName = "Actions"

export const dcolumns: { header: string; accessor: keyof OrderI }[] = [
  { header: "ID", accessor: "id" },
  { header: "Amount", accessor: "total" },
  { header: "Table Number", accessor: "tableNo" },
  { header: "Order Status", accessor: "status" },
  { header: "Date", accessor: "createdAt" },
  { header: "Actions", accessor: "action" },
]

export function DataTable({
  columns,
  data,
  updateOrderStatus,
}: DataTableProps) {
  const [filter, setFilter] = useState<string>("")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [server, setServer] = useState<any>(null)

  const handleRequestDevice = useCallback(async (): Promise<void> => {
    try {
      const selectedDevice = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [PRINT_SERVICE_UUID] }],
        optionalServices: [PRINT_SERVICE_UUID],
      })

      const gattServer = await selectedDevice.gatt.connect()

      if (gattServer) {
        setServer(gattServer)
        setIsConnected(true)
        console.log("Connected to GATT server:", gattServer)
      }
    } catch (error) {
      console.error("Error:", error)
      setIsConnected(false)
    }
  }, [])

  const filteredData = filter
    ? data.filter((order) => order.status === filter)
    : data

  return (
    <div className="w-full rounded-md border p-4">
      <div
        className="max-w-max cursor-pointer rounded border px-4 py-2"
        onClick={handleRequestDevice}
      >
        {isConnected ? "Connected ✅" : "Connect to Printer"}
      </div>
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
                  key={column.accessor}
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
                      key={column.accessor}
                      className={cn(
                        "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-600",
                        {
                          "text-gray-900": order.status === "PENDING",
                        }
                      )}
                    >
                      {column.accessor === "action" ? (
                        <Actions
                          rowOrder={order}
                          server={server}
                          updateOrderStatus={updateOrderStatus}
                        />
                      ) : column.accessor === "createdAt" ? (
                        utcToIst(order?.createdAt)?.toLocaleString("en-IN") ||
                        ""
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
                <div key={column.accessor} className="mb-2">
                  <span className="font-semibold">{column.header}: </span>
                  {column.accessor === "action" ? (
                    <Actions
                      rowOrder={order}
                      server={server}
                      updateOrderStatus={updateOrderStatus}
                    />
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
