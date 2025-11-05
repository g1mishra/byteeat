import { fromatDate } from "@/lib/dateUtils"
import { cn, getOrderToken } from "@/lib/utils"
import { Order, OrderStatus } from "@prisma/client"
import React from "react"

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
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredData.length > 0 ? (
            filteredData.map((order) => (
              <tr key={order.id} className="transition duration-150 ease-in-out hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className={cn("whitespace-nowrap px-6 py-4 text-sm", {
                      "font-medium text-yellow-600": order.status === "PENDING",
                      "font-medium text-red-600": order.status === "CANCELLED",
                      "font-medium text-green-600": order.status === "ACCEPTED",
                      "text-gray-600": !["PENDING", "CANCELLED", "ACCEPTED"].includes(order.status),
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
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
