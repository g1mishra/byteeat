import { getAllOrdersAllRestaurants } from "@/services/order.services"

import { DataTable, dcolumns } from "@/components/orders_table"

export default async function Orders() {
  const orders = await getAllOrdersAllRestaurants()

  return <DataTable columns={dcolumns} data={orders} />
}
