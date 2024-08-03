import { getAllOrdersByRestaurant } from "@/services/order.services"

import { DataTable, dcolumns } from "@/components/orders_table"

export default async function Orders({
  params,
}: {
  params: { restroId: string }
}) {
  const orders = await getAllOrdersByRestaurant(params.restroId)

  return <DataTable columns={dcolumns} data={orders} />
}
