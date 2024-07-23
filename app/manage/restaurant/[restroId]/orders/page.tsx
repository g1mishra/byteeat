import { useState } from "react"
import { redirect } from "next/navigation"
import { getAllOrdersByRestaurant } from "@/services/order.services"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, Order, dcolumns } from "@/components/orders_table"
import { Sidebar } from "@/components/sidebar"

export default async function Orders({
  params,
}: {
  params: { restroId: string }
}) {
  const orders = await getAllOrdersByRestaurant(params.restroId)
  const filtered: Order[] = orders.map(
    ({ id, total, tableNo, status, createdAt, restaurantId }) => ({
      id,
      total,
      tableNo,
      status,
      createdAt,
      restaurantId,
    })
  )
  const restroId: string = params.restroId

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={dcolumns} data={filtered} />
    </div>
  )
}
