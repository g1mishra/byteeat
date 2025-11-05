import NotFound from "@/app/not-found"
import { ThemeFormValues } from "@/components/manage/RestaurantTheme"
import OrderView from "@/components/slug-view/OrderView"
import { getBasePath } from "@/lib/utils"
import { getOrderWithItemsById } from "@/services/order.services"
import { fetchRestaurantBySlug } from "@/services/restaurantService"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

  const [orderDetails, restaurant] = await Promise.all([
    getOrderWithItemsById(searchParams.orderId),
    fetchRestaurantBySlug(slug),
  ])

  if (!orderDetails || !restaurant) return <NotFound />

  const theme = restaurant.theme as ThemeFormValues

  return (
    <>
      <div
        className="flex h-14 items-center justify-between space-x-2 px-4"
        style={{
          backgroundColor: theme?.primaryColor || "#000000",
          color: theme?.secondaryColor || "#ffffff",
        }}
      >
        <Link href={getBasePath(slug)} className="text-current">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="-ml-8 flex-1 text-center text-xl font-bold text-current">Order Details</h1>
      </div>
      <OrderView orderDetails={orderDetails} theme={restaurant.theme as any} />
    </>
  )
}

export default OrderPage
