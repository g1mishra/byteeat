"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import useMediaQuery from "@/hook/useMediaQuery"
import { Order, OrderStatus, OrderType } from "@prisma/client"

import OrderList from "./OrderList"
import OrderTable from "./OrderTable"
import Loading from "./loader"
import { Button } from "./ui/button"

const OrderDetails = dynamic(() => import("./OrderDetails"), {
  loading: () => <Loading />,
  ssr: false,
})

interface DataTableProps {
  isLoading?: boolean
  reFetchInitialOrders?: () => void
  columns: { header: string; accessor: keyof OrderI }[]
  data: Order[]
  updateOrderStatus?: (id: string, status: OrderStatus) => void
}

interface OrderI extends Order {
  action: string
}

export const dcolumns: { header: string; accessor: keyof OrderI }[] = [
  { header: "Order Token", accessor: "id" },
  { header: "Order Type", accessor: "type" },
  { header: "Amount", accessor: "total" },
  { header: "Table Number", accessor: "tableNo" },
  { header: "Order Status", accessor: "status" },
  { header: "Date", accessor: "createdAt" },
  { header: "Action", accessor: "action" },
]

export function OrdersTableRenderer({
  reFetchInitialOrders,
  isLoading = false,
  columns,
  data,
  updateOrderStatus,
}: DataTableProps) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All")
  const { handleRequestDevice, isConnected } = useBluetoothPrinter()
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | "All">(
    "QR"
  )

  const filteredData = data.filter((order) => {
    const matchesStatus =
      statusFilter === "All" ||
      order.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType =
      orderTypeFilter === "All" ||
      order.type?.toLowerCase() === orderTypeFilter.toLowerCase()
    return matchesStatus && matchesType
  })

  const handleOpenOrderDetails = useCallback((order: Order) => {
    setCurrentOrder(order)
  }, [])

  const handleCloseOrderDetails = useCallback(() => {
    setCurrentOrder(null)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (reFetchInitialOrders && typeof reFetchInitialOrders === "function") {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 rounded-md border px-4 py-8">
        <h3 className="text-lg font-medium">Failed to fetch orders.</h3>
        <Button size="sm" variant="outline" onClick={reFetchInitialOrders}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full rounded-md border p-4">
      <div className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="max-w-max cursor-pointer rounded border px-4 py-2 transition-colors hover:bg-gray-100"
          onClick={handleRequestDevice}
        >
          {isConnected ? "Connected ✅" : "Connect to Printer"}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label
              htmlFor="orderTypeFilter"
              className="text-sm font-medium text-gray-700"
            >
              Type:
            </label>
            <select
              id="orderTypeFilter"
              value={orderTypeFilter}
              onChange={(event) =>
                setOrderTypeFilter(event.target.value as OrderType | "All")
              }
              className="w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="QR">QR</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <label
              htmlFor="statusFilter"
              className="text-sm font-medium text-gray-700"
            >
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as OrderStatus | "All")
              }
              className="w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      {isMobile ? (
        <OrderList
          columns={columns}
          filteredData={filteredData}
          updateOrderStatus={updateOrderStatus}
          handleOpenOrderDetails={handleOpenOrderDetails}
        />
      ) : (
        <OrderTable
          columns={columns}
          filteredData={filteredData}
          updateOrderStatus={updateOrderStatus}
          handleOpenOrderDetails={handleOpenOrderDetails}
        />
      )}
      {currentOrder && (
        <OrderDetails
          orderId={currentOrder?.id}
          restaurantId={currentOrder?.restaurantId}
          isOpen={!!currentOrder}
          onClose={handleCloseOrderDetails}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}
