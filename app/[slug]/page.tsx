import { Metadata, ResolvingMetadata } from "next"
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

  if (!restaurant) return notFound()

  const tableNumber = Number(searchParams.tableNumber)
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
          <MenuView data={restaurant?.ItemCategory} />
        ) : null}
      </div>
    </>
  )
}

export default Welcome

export async function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug

  const response = await fetchRestaurantBySlug(slug)

  const previousImages = (await parent).openGraph?.images || []

  const { name, logoUrl, address_string, city, state, country, tableSize } =
    response || {}

  return {
    title: `${name || slug} - Restaurant in ${city}, ${state}`,
    description: `Experience a delightful dining experience at ${name} in ${city}, ${state}. Located at ${address_string}, our restaurant offers a cozy atmosphere and delicious food. Book your table today!`,
    openGraph: {
      title: `${name} - Restaurant`,
      description: `Visit ${name} in ${city} for a memorable dining experience. Located at ${address_string}, we provide a cozy ambiance and great food. Discover our menu and make a reservation today!`,
      images: [logoUrl || "", ...previousImages],
      url: `https://byteeat.in/${slug}`,
      type: "website",
      siteName: "ByteEat",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Restaurant`,
      description: `Enjoy a great meal at ${name} in ${city}. Located at ${address_string}, our restaurant offers a cozy setting and delicious dishes. Reserve your table now!`,
      images: [logoUrl || ""],
    },
  }
}
