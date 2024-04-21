import { notFound } from "next/navigation"
import { MenuItemI, fetchPrice } from "@/services/menuService"
import { FullAdress, fetchRestaurantBySlug } from "@/services/restaurantService"
import { MenuIcon } from "lucide-react"

import { formatAddress } from "@/lib/string"
import MenuView from "@/components/cat_and_items"
import LogoOrAvatar from "@/components/logo-or-avatar"
import { Sidebar } from "@/components/sidebar"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

const Welcome = async ({
  params,
}: {
  params: {
    slug: string
  }
}) => {
  const response = await fetchRestaurantBySlug(params.slug, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!response) {
    notFound()
  }

  const address = formatAddress(response as FullAdress)

  return (
    <div className="container relative flex flex-col gap-y-2 py-4 sm:py-8">
      <Sidebar name={response?.name} address={address} />
      <div className="flex items-center justify-center">
        <LogoOrAvatar
          src={response?.logoUrl}
          name={response?.name}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{response?.name}</h1>
        <p className="text-sm font-light">{address}</p>
      </div>

      {response?.ItemCategory ? (
        <MenuView data={response?.ItemCategory} />
      ) : null}
    </div>
  )
}

export default Welcome
