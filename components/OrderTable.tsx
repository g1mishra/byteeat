import React from "react"
import { Order, OrderStatus } from "@prisma/client"

import { fromatDate } from "@/lib/dateUtils"
import { cn, getOrderToken } from "@/lib/utils"

import OrderTableAction from "./OrderTableAction"

interface OrderTableProps {
  columns: { header: string; accessor: keyof OrderI }[]
  filteredData: Order[]
  reFetchInitialOrders?: () => void
  updateOrderStatus?: (id: string, status: OrderStatus) => void
  handleOpenOrderDetails: (order: Order) => void
}

interface OrderI extends Order {
  action: string
}

const OrderTable: React.FC<OrderTableProps> = ({
  columns,
  filteredData,
  updateOrderStatus,
  handleOpenOrderDetails,
}) => {
  return (
    <div className="overflow-x-auto">
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
  )
}

export default OrderTable
