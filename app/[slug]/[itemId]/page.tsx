import Image from "next/image"
import { fetchMenuItem } from "@/services/menuService"

import AddToCart from "./AddToCart"
import BackButton from "./BackButton"
import ItemViewHeader from "./ItemViewHeader"

export default async function Component({
  params: { slug, itemId },
}: {
  params: {
    slug: string
    itemId: string
  }
}) {
  const response = await fetchMenuItem(itemId)

  const imgPath = response?.imgPath?.trim()
  const images = imgPath ? imgPath.split(";") : []

  return (
    <>
      <ItemViewHeader />
      <div className="grid gap-4 px-6 py-4">
        <div>
          <h3 className="mb-2 text-2xl font-bold">{response?.dish}</h3>
          <p className="text-muted-foreground">{response?.description}</p>
        </div>
        <div className="group relative">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Dish Image ${index}`}
              width={600}
              height={300}
              className="size-full rounded object-cover transition-opacity group-hover:opacity-95"
            />
          ))}
        </div>
        <AddToCart response={response} />
      </div>
    </>
  )
}
