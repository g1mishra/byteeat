import { getTodayOrdersByRestaurant } from "@/services/order.services"
import { Sidebar } from "@/components/sidebar_other"
import { DataTable, dcolumns } from "@/components/orders_table"
import { getHrefsAndLinks } from "./hrefsandlinks"

export default async function Orders({
  params,
}: {
  params: { restroId: string }
}) {
  const date: Date = new Date()
  const orders = await getTodayOrdersByRestaurant(params.restroId, date)

  return (
    <div className="flex">
      <Sidebar
        heading="Orders"
        hrefsAndLinks={getHrefsAndLinks(params.restroId)}/>
      <DataTable columns={dcolumns} data={orders} />
    </div>
  )
}
