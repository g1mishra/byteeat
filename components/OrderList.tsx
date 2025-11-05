import { fromatDate } from "@/lib/dateUtils"
import { cn, getOrderToken } from "@/lib/utils"
import { Order, OrderStatus } from "@prisma/client"
import React from "react"

import OrderTableAction from "./OrderTableAction"

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
    <div className="space-y-4">
      {filteredData.length > 0 ? (
        filteredData.map((order) => (
          <div
            key={order.id}
            className={cn("rounded-lg border p-4 shadow-sm transition duration-150 ease-in-out", {
              "border-yellow-200 bg-yellow-50": order.status === "PENDING",
              "border-red-200 bg-red-50": order.status === "CANCELLED",
              "border-green-200 bg-green-50": order.status === "ACCEPTED",
              "bg-white": !["PENDING", "CANCELLED", "ACCEPTED"].includes(order.status),
            })}
          >
            {columns.map((column) => (
              <div key={column.accessor} className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">{column.header}</span>
                <span
                  className={cn("text-sm", {
                    "font-medium text-yellow-600":
                      order.status === "PENDING" && column.accessor === "status",
                    "font-medium text-red-600":
                      order.status === "CANCELLED" && column.accessor === "status",
                    "font-medium text-green-600":
                      order.status === "ACCEPTED" && column.accessor === "status",
                    "text-gray-800": column.accessor !== "status",
                  })}
                >
                  {column.accessor === "action" ? (
                    <OrderTableAction
                      rowOrder={order}
                      updateOrderStatus={updateOrderStatus}
                      onOpenOrderDetails={() => handleOpenOrderDetails(order)}
                    />
                  ) : column.accessor === "createdAt" ? (
                    fromatDate(order?.createdAt) || ""
                  ) : column.accessor === "id" ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {getOrderToken(order.id)?.toUpperCase()}
                    </span>
                  ) : column.accessor === "tableNo" ? (
                    order.tableNo === 0 ? (
                      "N/A"
                    ) : (
                      order.tableNo
                    )
                  ) : (
                    String(order[column.accessor])
                  )}
                </span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="flex h-24 items-center justify-center text-gray-500">No results found.</div>
      )}
    </div>
  )
}

export default OrderList
