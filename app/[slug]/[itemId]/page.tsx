import Image from "next/image"
import { fetchMenuItem } from "@/services/menuService"
import { FullAdress, fetchRestaurantBySlug } from "@/services/restaurantService"

import { formatAddress } from "@/lib/string"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"

import AddToCart from "./AddToCart"
import BackButton from "./BackButton"

export default async function Component({
  params: { slug, itemId },
}: {
  params: {
    slug: string
    itemId: string
  }
}) {
  const restaurant = await fetchRestaurantBySlug(slug)
  const response = await fetchMenuItem(itemId)

  const address = formatAddress(restaurant as FullAdress)

  const imgPath = response?.imgPath?.trim()
  const images = imgPath ? imgPath.split(";") : []

  return (
    <div className="px-6">
      {restaurant ? (
        <Sidebar
          name={restaurant?.name}
          socials={restaurant?.SocialLinks}
          address={address}
          addBackButton={true}
        />
      ) : null}
      <div className="grid gap-6">
        <div className="group relative">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Dish Image ${index}`}
              width={600}
              height={400}
              className="size-full object-cover transition-opacity group-hover:opacity-80"
            />
          ))}
        </div>
        <AddToCart response={response} />
        <BackButton />
      </div>
    </div>
  )
}
