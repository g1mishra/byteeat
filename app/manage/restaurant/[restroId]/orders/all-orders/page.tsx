import { getAllOrdersByRestaurant } from "@/services/order.services"
import { Sidebar } from "@/components/sidebar_other"
import { getHrefsAndLinks } from "../hrefsandlinks"
import { DataTable, dcolumns } from "@/components/orders_table"

export default async function Orders({
    params,
}: {
    params: { restroId: string }
}) {
    const orders = await getAllOrdersByRestaurant(params.restroId)

    return (
        <div className="flex">
        <Sidebar
          heading="Orders"
          hrefsAndLinks={getHrefsAndLinks(params.restroId)}/>
        <DataTable columns={dcolumns} data={orders} />
      </div>
    )
}
