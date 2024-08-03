"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateOrder } from "@/services/order.services"
import { Order, OrderStatus } from "@prisma/client"
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

interface DataTableProps {
  columns: { header: string; accessor: keyof OrderI }[]
  data: Order[]
  polling?: boolean
}

const statuses = Object.values(OrderStatus)

function Actions({ rowOrder }: { rowOrder: Order }) {
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
  const router = useRouter()

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
                        <Actions rowOrder={order} />
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
                    <Actions rowOrder={order} />
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
