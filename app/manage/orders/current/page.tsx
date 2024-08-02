import { getTodayOrdersAllRestaurants } from "@/services/order.services"

import { DataTable, dcolumns } from "@/components/orders_table"

export default async function Orders() {
  const date: Date = new Date()
  const orders = await getTodayOrdersAllRestaurants(date)

  return <DataTable columns={dcolumns} data={orders} />
}
