import { getTodayOrdersAllRestaurants } from "@/services/order.services"

import { DataTable, dcolumns } from "@/components/orders_table"
import { Sidebar } from "@/components/sidebar_other"

export default async function Orders() {
  const date: Date = new Date()
  const orders = await getTodayOrdersAllRestaurants(date)

  const hrefsAndLinks = [
    { href: `/manage/restaurant/all/orders`, text: "Current Orders" },
    { href: `/manage/restaurant/all/orders/all-orders`, text: "All Orders" },
    { href: `/manage/`, text: "Back to dashboard" },
  ]

  return (
    <div className="flex">
      <Sidebar heading="Orders" hrefsAndLinks={hrefsAndLinks} />
      <DataTable columns={dcolumns} data={orders} />
    </div>
  )
}
