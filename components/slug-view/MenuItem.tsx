"use client"

import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MenuItemI } from "@/services/menuService"

import { cn, getPathWithQuery } from "@/lib/utils"

import VegOrNonVeg from "../veg-or-nonveg"
import QuantityControls from "./QuantityControls"

const MenuItem = memo(
  ({
    item,
    image,
    className = "",
  }: {
    item: MenuItemI & { labels?: string[] }
    image?: string
    className?: string
  }) => {
    const params = useParams()
    return (
      <div
        className={cn("[&_.hr-line]:last:hidden [&_div]:last:mb-0", className)}
      >
        {image ? (
          <ItemCard item={item} image={image} slug={params.slug as string} />
        ) : (
          <ItemRow item={item} slug={params.slug as string} />
        )}
      </div>
    )
  }
)

MenuItem.displayName = "MenuItem"
export default MenuItem

const ItemCard = memo(
  ({ item, image, slug }: { item: MenuItemI; image: string; slug: string }) => {
    if (!item?.id) return null

    return (
      <div className="overflow-hidden rounded border bg-slate-100/50">
        <div className="flex">
          <Image
            loading="lazy"
            src={image}
            alt={item.dish}
            className="w-1/2 rounded-l object-cover sm:w-1/3 sm:object-cover"
            width={500}
            height={500}
          />
          <div className="flex w-1/2 flex-col gap-1 p-4 sm:w-2/3">
            <Link
              className="w-full flex-1 self-start"
              href={getPathWithQuery(`/${slug}/${item.id}`)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">{item.dish}</h3>
                {item.type === "FOOD" ? (
                  <VegOrNonVeg isVeg={item.isVeg} />
                ) : null}
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">
                {item.description}
              </p>
            </Link>

            <div className="flex  min-w-28 shrink-0 flex-col items-end self-end text-right">
              <p className="mb-1 text-sm font-medium">
                ₹{item.PriceItemMap?.[0]?.price}
              </p>
              <QuantityControls
                item={item}
                className="-mr-3"
                addBtnClassName="pr-0"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ItemCard.displayName = "ItemCard"

const ItemRow = memo(({ item, slug }: { item: MenuItemI; slug: string }) => {
  if (!item?.id) return null

  return (
    <div className="mb-2 flex flex-col">
      <div className="mb-2 flex items-center justify-between gap-1">
        <Link
          href={getPathWithQuery(`/${slug}/${item.id}`)}
          className="max-w-[95%] flex-1 self-start"
        >
          <h3 className="flex items-center gap-1 text-base font-medium">
            {item.type === "FOOD" ? <VegOrNonVeg isVeg={item.isVeg} /> : null}
            {item.dish}
          </h3>
          <p className="line-clamp-3 text-sm text-gray-600">
            {item.description}
          </p>
        </Link>
        <div className="flex  min-w-28 shrink-0 flex-col items-end self-end text-right">
          <p className="mb-1 pr-4 text-sm font-medium">
            ₹{item.PriceItemMap?.[0]?.price}
          </p>
          <QuantityControls item={item} />
        </div>
      </div>
      <div
        className={cn("hr-line mt-0.5 border-b border-[#ededed]", {
          "mt-0": !item.description,
        })}
      />
    </div>
  )
})

ItemRow.displayName = "ItemRow"
