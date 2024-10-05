import Link from "next/link"
import { getOrderWithItemsById } from "@/services/order.services"
import { ArrowLeft } from "lucide-react"

import { getBasePath } from "@/lib/utils"
import OrderView from "@/components/slug-view/OrderView"
import NotFound from "@/app/not-found"

const OrderPage = async ({
  params: { slug },
  searchParams,
}: {
  params: {
    slug: string
  }
  searchParams: {
    orderId: string
    tableNumber: string
  }
}) => {
  if (!searchParams?.orderId) return <NotFound />
  const orderDetails = await getOrderWithItemsById(searchParams.orderId)
  if (!orderDetails) return <NotFound />
  return (
    <>
      <div className="bg-primary flex h-14 items-center justify-between space-x-2  px-4">
        <Link href={getBasePath(slug)} className="text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="-ml-8 flex-1 text-center text-xl font-bold text-white">Order Details</h1>
      </div>
      <OrderView orderDetails={orderDetails} />
    </>
  )
}

export default OrderPage
