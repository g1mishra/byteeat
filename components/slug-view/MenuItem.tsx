"use client"

import { MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { MenuItemI } from "@/services/menuService"

import { cn } from "@/lib/utils"
import { useCart } from "@/app/store/CartProvider"

import VegOrNonVeg from "../veg-or-nonveg"

const MenuItem = ({
  item,
  image,
  className = "",
}: {
  item: MenuItemI & {
    labels?: string[]
  }
  image?: string
  className?: string
}) => {
  const params = useParams()
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get("tableNumber")
  const query = tableNumber ? `?tableNumber=${tableNumber}` : ""

  return (
    <Link
      href={`/${params.slug}/${item.id}${query}`}
      className={cn("[&_*]:last:mb-0 [&_.hr-line]:last:hidden", className)}
    >
      {image ? <ItemCard {...item} image={image} /> : <ItemRow {...item} />}
    </Link>
  )
}

export default MenuItem

const ItemCard = (item: MenuItemI & { image: string }) => {
  const { cart, setCart } = useCart()((state) => state)

  const onAdd = (e: MouseEvent<HTMLElement>) => {
    if (item.PriceItemMap && item.PriceItemMap.length > 1) {
      console.log("Multiple prices")
      return
    }
    e.preventDefault()
    setCart(
      {
        id: item.id as string,
        name: item.dish as string,
        price: item.PriceItemMap?.[0].price || 0,
        quantity: 1,
      },
      "inc"
    )
  }

  const totalQty = cart.reduce(
    (acc, _item) => (_item.id === item.id ? acc + _item.quantity : acc),
    0
  )

  if (!item || !item.id) return null

  return (
    <div className="overflow-hidden rounded bg-slate-100/50">
      <div className="flex">
        <Image
          loading="lazy"
          src={item.image}
          alt={item.dish}
          className="w-1/3 object-cover"
          width={300}
          height={300}
        />
        <div className="flex w-2/3 flex-col p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{item.dish}</h3>
            {item.foodOrBar && <VegOrNonVeg isVeg={item.isVeg} />}
          </div>
          <p className="mt-2 line-clamp-4 flex-1 text-sm text-gray-600">
            {item.description}
          </p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-base font-bold">
              {item.PriceItemMap?.[0].price}
            </p>
            {totalQty ? (
              <div className="flex items-center gap-2">
                <button className="font-semibold">-</button>
                <p className="mx-1">{totalQty}</p>
                <button className="font-semibold">+</button>
              </div>
            ) : (
              <button
                className="text-xs font-semibold text-orange-300"
                onClick={onAdd}
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ItemRow = (item: MenuItemI & {}) => {
  const { cart, setCart } = useCart()((state) => state)

  const onAdd = (e: MouseEvent<HTMLElement>) => {
    if (item.PriceItemMap && item.PriceItemMap.length > 1) {
      console.log("Multiple prices")
      return
    }
    e.preventDefault()
    setCart(
      {
        id: item.id as string,
        name: item.dish as string,
        price: item.PriceItemMap?.[0].price || 0,
        quantity: 1,
      },
      "inc"
    )
  }

  const currentItem = cart.find((elem) => elem.id === item.id)

  const handleQuantityChange = (operation: "inc" | "dec") => {
    if (!currentItem) return

    setCart(
      {
        id: item.id as string,
        name: item.dish,
        price: item.PriceItemMap?.[0].price || 0,
        quantity: currentItem?.quantity || 0,
        portion: item.PriceItemMap?.[0].portion || "",
      },
      operation
    )
  }

  return (
    <div className="mb-2 flex flex-col pr-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1 text-base font-semibold">
            {item.foodOrBar && <VegOrNonVeg isVeg={item.isVeg} />}
            {item.dish}
          </h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold">{item.PriceItemMap?.[0].price}</p>
          {currentItem?.quantity ? (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <button
                className="font-semibold"
                onClick={() => handleQuantityChange("dec")}
                disabled={currentItem.quantity === 1}
              >
                -
              </button>
              <p className="mx-1">{currentItem.quantity}</p>
              <button
                className="font-semibold"
                onClick={() => handleQuantityChange("inc")}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="text-xs font-semibold text-orange-300"
              onClick={onAdd}
            >
              ADD
            </button>
          )}
        </div>
      </div>
      <div className="hr-line mt-2 border-b border-[#ededed]" />
    </div>
  )
}

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
