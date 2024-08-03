import { getTodayOrdersByRestaurant } from "@/services/order.services"

import { DataTable, dcolumns } from "@/components/orders_table"


export default async function Orders({
  params,
}: {
  params: { restroId: string }
}) {
  const date: Date = new Date()
  const orders = await getTodayOrdersByRestaurant(params.restroId, date)

  return <DataTable columns={dcolumns} data={orders} />
}
