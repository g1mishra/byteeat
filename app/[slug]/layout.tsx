import { ThemeFormValues } from "@/components/manage/RestaurantTheme"
import { getBasePath } from "@/lib/utils"
import { fetchRestaurantBySlug } from "@/services/restaurantService"
import { notFound, redirect } from "next/navigation"

import CartProvider from "../store/CartProvider"

interface SlugLayoutProps {
  children: React.ReactNode
  params: { slug: string }
  searchParams?: { tableNumber?: string }
}

const SlugLayout = async ({ children, params, searchParams }: SlugLayoutProps) => {
  const { slug } = params

  const restaurant = await fetchRestaurantBySlug(slug, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!restaurant) {
    return notFound()
  }

  const tableNumber = Number(searchParams?.tableNumber)
  if (tableNumber < 1 || tableNumber > restaurant.tableSize) {
    return redirect(getBasePath(slug))
  }

  const theme = (restaurant.theme as ThemeFormValues) || {}

  const themeStyles = {
    "--background-color": theme.backgroundColor || "#f5f5f5",
    "--primary-color": theme.primaryColor || "#000000",
    "--secondary-color": theme.secondaryColor || "#ffffff",
    fontFamily:
      theme.fontFamily === "inter"
        ? "'Inter', sans-serif"
        : theme.fontFamily === "poppins"
          ? "'Poppins', sans-serif"
          : "'Roboto', sans-serif",
  } as React.CSSProperties

  return (
    <CartProvider>
      <div
        style={themeStyles}
        className="container relative flex min-h-screen max-w-screen-sm flex-col gap-y-2 bg-white p-0 sm:border sm:border-t-0 sm:shadow-xl"
      >
        {children}
      </div>
    </CartProvider>
  )
}

export default SlugLayout
