"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Router } from "next/router"
import { updateOrderStatus } from "@/services/order.services"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "./ui/input"

export type Order = {
  id: string
  total: number | undefined
  tableNo: number
  status: string
  createdAt: Date
  restaurantId: string
}

function Actions(rowOrder: any) {
  const router = useRouter()
  console.log("HER", rowOrder)

  console.log(router)

  const handleStatusChange = async (newStatus: string) => {
    console.log("running me")

    try {
      const updatedOrder = await updateOrderStatus(
        rowOrder.rowOrder.id,
        newStatus
      )
      console.log("Order status updated successfully", updatedOrder)
      router.refresh()

      // Optionally, update the local state or refetch the data
    } catch (error) {
      console.error("Failed to update order status", error)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change status</DropdownMenuLabel>
        {statuses.map((curr) =>
          curr != rowOrder.rowOrder.status ? (
            <DropdownMenuItem
              key={curr}
              onClick={() => {
                console.log("onclick")
                handleStatusChange(curr)
              }}
            >
              {curr}
            </DropdownMenuItem>
          ) : null
        )}
        <DropdownMenuSeparator />
        <Link
          href={`/manage/restaurant/${rowOrder.rowOrder.restaurantId}/orders/${rowOrder.rowOrder.id}`}
        >
          <DropdownMenuItem>Open order</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const statuses = ["pending", "delivered", "cancelled"]
export const dcolumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "total",
    header: "Amount",
  },
  {
    accessorKey: "tableNo",
    header: "Table Number",
  },
  {
    accessorKey: "status",
    header: "Order Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowOrder = row.original

      return <Actions rowOrder={rowOrder} />
    },
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4">
        <select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
