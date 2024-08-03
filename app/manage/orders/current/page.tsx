import { getTodayOrdersAllRestaurants } from "@/services/order.services"

import { utcToIst } from "@/lib/utils"
import { DataTable, dcolumns } from "@/components/orders_table"

export default async function Orders() {
  const date = new Date()
  const orders = await getTodayOrdersAllRestaurants(date)

  const formattedOrders = orders.map((order) => ({
    ...order,
    createdAt: utcToIst(order.createdAt),
    total: JSON.parse(JSON.stringify(order.total)),
  }))

  return (
    <>
      <DataTable columns={dcolumns} data={formattedOrders} polling={true} />
    </>
  )
}
