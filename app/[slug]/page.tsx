import { notFound, redirect } from "next/navigation"
import { MenuItemI } from "@/services/menuService"
import { FullAdress, fetchRestaurantBySlug } from "@/services/restaurantService"

import { formatAddress } from "@/lib/string"
import LogoOrAvatar from "@/components/logo-or-avatar"
import { Sidebar } from "@/components/sidebar"
import MenuView from "@/components/slug-view/MenuView"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

const Welcome = async ({
  params,
  searchParams,
}: {
  params: {
    slug: string
  }
  searchParams: {
    tableNumber: string
  }
}) => {
  const restaurant = await fetchRestaurantBySlug(params.slug, {
    includeMenuItems: true,
    includePrice: true,
  })

  const tableNumber = Number(searchParams.tableNumber)
  if (!restaurant) return notFound()
  if (tableNumber === 0 || tableNumber > restaurant?.tableSize) {
    return redirect(`/${params.slug}`)
  }
  const address = formatAddress(restaurant as FullAdress)

  return (
    <>
      <Sidebar
        name={restaurant?.name}
        socials={restaurant.SocialLinks}
        address={address}
      />
      <div className="px-6 py-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center">
            <LogoOrAvatar
              src={restaurant?.logoUrl}
              name={restaurant?.name}
              className="max-w-52"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {restaurant?.name}
            </h1>
            <p className="text-sm font-light text-gray-500">{address}</p>
          </div>
        </div>

        {restaurant?.ItemCategory ? (
          <MenuView data={restaurant?.ItemCategory} tableNo={tableNumber} />
        ) : null}
      </div>
    </>
  )
}

export default Welcome
