"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import useMediaQuery from "@/hook/useMediaQuery"
import { Order, OrderStatus } from "@prisma/client"


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
  const [filter, setFilter] = useState<string>("")
  const { handleRequestDevice, isConnected } = useBluetoothPrinter()
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredData = filter
    ? data.filter((order) => order.status === filter)
    : data

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
