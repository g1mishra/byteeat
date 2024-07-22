"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MenuItemI } from "@/services/menuService"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import VegOrNonVeg from "../veg-or-nonveg"

const MenuItem = ({
  item,
  images,
  lowestPrice,
  showAddToCart = false,
}: {
  item: MenuItemI & {
    labels?: string[]
  }
  images: string[]
  lowestPrice?: number
  showAddToCart?: boolean
}) => {
  const params = useParams()
  return (
    <div className="bg-background group relative rounded-lg border p-4 transition-colors hover:border-collapse">
      <Link href={`/${params.slug}/${item.id}`}>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {item.foodOrBar ? (
              <div className="h-4">
                <VegOrNonVeg isVeg={item.isVeg} />
              </div>
            ) : null}
            {item?.labels?.map((label, index) => (
              <LabelItem key={index} label={label} />
            ))}
          </div>
          {images?.length > 0 ? (
            <div className="relative flex max-h-36 justify-center overflow-hidden rounded-lg">
              <Image
                loading="lazy"
                src={images[0]}
                className="h-full w-auto rounded-lg object-contain transition-opacity group-hover:opacity-80"
                alt={item.dish}
                width={300}
                height={300}
              />
            </div>
          ) : null}

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.dish}</h3>
              <div className="text-2xl font-bold">
                {lowestPrice === -1
                  ? item.PriceItemMap?.[0].price
                  : lowestPrice}
              </div>
            </div>
            <p className="text-sm leading-relaxed">{item.description}</p>
          </div>
          {showAddToCart ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={(e) => {
                if (item?.PriceItemMap && item?.PriceItemMap?.length > 1) {
                  console.log("Continue to select portion")
                  return
                }
                e.preventDefault()
                console.log("Add to cart")
              }}
            >
              Add to Cart
            </Button>
          ) : null}
        </div>
      </Link>
    </div>
  )
}

export default MenuItem

const LabelItem = ({ label }: { label: string }) => {
  return (
    <div
      className={cn(
        "flex h-4 items-center justify-center rounded p-1 px-2 py-0.5 text-center text-xs font-medium text-white lg:h-[1.4rem] lg:text-sm",
        getLabelColor(label)
      )}
    >
      {label}
    </div>
  )
}

const getLabelColor = (label: string) => {
  switch (label.toLowerCase()) {
    case "must-try":
      return "bg-[#23537C]"
    case "bestseller":
      return "bg-[#D58C43]"
    default:
      return "bg-gray-200"
  }
}
