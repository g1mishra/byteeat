import Image from "next/image"
import { MenuItemI } from "@/services/menuService"

import { cn } from "@/lib/utils"

import VegOrNonVeg from "./veg-or-nonveg"

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

const MenuItem = ({
  item,
  images,
}: {
  item: MenuItemI & {
    labels?: string[]
  }
  images: string[]
}) => {
  return (
    <div className="flex flex-wrap justify-between">
      <div className="w-8/12">
        <div className="flex flex-wrap items-center gap-2">
          {item.foodOrBar ? (
            <div className="h-4">
              <VegOrNonVeg isVeg={item.isVeg} />
            </div>
          ) : null}
          {item?.labels?.map((label, index) => (
            <div
              key={index}
              className={`flex h-4 items-center justify-center rounded p-1 px-2 py-0.5 text-center text-xs font-medium text-white lg:h-[1.4rem] lg:text-sm ${getLabelColor(
                label
              )}`}
            >
              {label?.split("-").join(" ")}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex">
          <div className="flex w-10/12 flex-col">
            <p className="subtitle-2 mb-1 break-all">{item.dish}</p>
            <p className="subtitle-3 mb-1 space-x-1">
              {item.PriceItemMap?.map(
                (price: { portion: string; price: any }) => (
                  <span>
                    {price.portion != ""
                      ? `${price.portion}: ₹${price.price}`
                      : `₹${price.price}`}
                  </span>
                )
              )}
            </p>
            <p className={cn("body-3 text-gray-60 break-all leading-relaxed")}>
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {images?.length > 0 ? (
        <div className="relative flex size-24 items-center justify-center rounded bg-gray-200">
          <div className="object-fit flex size-full items-center justify-center overflow-hidden rounded border border-gray-200 object-cover">
            <Image
              loading="lazy"
              src={images[0]}
              className="size-full object-cover object-center"
              alt={item.dish}
              fill
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MenuItem
