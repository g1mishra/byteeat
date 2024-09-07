import React from "react"
import { Order, OrderStatus } from "@prisma/client"

import { fromatDate } from "@/lib/dateUtils"

import OrderTableAction from "./OrderTableAction"
import { getOrderToken } from "@/lib/utils"

interface OrderListProps {
  columns: { header: string; accessor: keyof OrderI }[]
  filteredData: Order[]
  updateOrderStatus?: (id: string, status: OrderStatus) => void
  handleOpenOrderDetails: (order: Order) => void
}

interface OrderI extends Order {
  action: string
}

const OrderList: React.FC<OrderListProps> = ({
  columns,
  filteredData,
  updateOrderStatus,
  handleOpenOrderDetails,
}) => {
  return (
    <>
      {filteredData.length > 0 ? (
        filteredData.map((order) => (
          <div key={order.id} className="mb-4 rounded-lg border p-4 shadow-sm">
            {columns.map((column) => (
              <div key={column.accessor} className="mb-2">
                <span className="font-semibold">{column.header}: </span>
                {column.accessor === "action" ? (
                  <OrderTableAction
                    rowOrder={order}
                    updateOrderStatus={updateOrderStatus}
                    onOpenOrderDetails={() => handleOpenOrderDetails(order)}
                  />
                ) : column.accessor === "createdAt" ? (
                  fromatDate(order?.createdAt) || ""
                ) : column.accessor === "id" ? (
                  <span className="text-sm text-gray-500">
                    {getOrderToken(order.id)?.toUpperCase()}
                  </span>
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
    </>
  )
}

export default OrderList
