"use client"

import { MouseEvent, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MenuItemI } from "@/services/menuService"
import { Minus, Plus } from "lucide-react"

import { Cart } from "@/lib/types"
import { cn, getPathWithQuery } from "@/lib/utils"

import VegOrNonVeg from "../veg-or-nonveg"
import { addItemToCart, changeItemQuantity } from "./util"

const MenuItem = ({
  item,
  image,
  className = "",
  cart,
  setCart,
}: {
  item: MenuItemI & {
    labels?: string[]
  }
  image?: string
  className?: string
  cart: Cart[]
  setCart: (item: Cart, operation: "inc" | "dec") => void
}) => {
  const params = useParams()

  const totalQty = cart.reduce(
    (acc, _item) => (_item.id === item.id ? acc + _item.quantity : acc),
    0
  )

  const currentItem = cart.find((elem) => elem.id === item.id)

  const onAdd = useCallback(
    (event: MouseEvent<HTMLElement>) => addItemToCart(item, setCart)(event),
    [item, setCart]
  )
  const handleQuantityChange = useCallback(
    (event: MouseEvent<HTMLElement>, operation: "inc" | "dec") => {
      changeItemQuantity(item, currentItem, setCart)(event, operation)
    },
    [item, currentItem, setCart]
  )

  return (
    <Link
      href={getPathWithQuery(`/${params.slug}/${item.id}`)}
      className={cn("[&_*]:last:mb-0 [&_.hr-line]:last:hidden", className)}
    >
      {image ? (
        <ItemCard
          item={item}
          image={image}
          totalQty={totalQty}
          onAddClick={onAdd}
          handleQuantityChange={handleQuantityChange}
        />
      ) : (
        <ItemRow
          item={item}
          currentItem={currentItem}
          onAddClick={onAdd}
          handleQuantityChange={handleQuantityChange}
        />
      )}
    </Link>
  )
}

export default MenuItem

const ItemCard = ({
  item,
  image,
  totalQty,
  onAddClick,
  handleQuantityChange,
}: {
  item: MenuItemI
  image: string
  totalQty: number
  onAddClick: (e: MouseEvent<HTMLElement>) => void
  handleQuantityChange: (
    event: MouseEvent<HTMLElement>,
    operation: "inc" | "dec"
  ) => void
}) => {
  if (!item || !item.id) return null

  return (
    <div className="overflow-hidden rounded bg-slate-100/50">
      <div className="flex">
        <Image
          loading="lazy"
          src={image}
          alt={item.dish}
          className="w-1/2 object-cover sm:w-1/3 sm:object-cover"
          width={300}
          height={300}
        />
        <div className="flex w-1/2 flex-col p-4 sm:w-2/3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{item.dish}</h3>
            {item.foodOrBar && <VegOrNonVeg isVeg={item.isVeg} />}
          </div>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">
            {item.description}
          </p>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-base font-bold">
              {item.PriceItemMap?.[0].price}
            </p>
            {totalQty ? (
              <div className="flex items-center justify-end">
                <button
                  className="px-1 font-semibold"
                  onClick={(e) => handleQuantityChange(e, "dec")}
                >
                  <Minus size={14} />
                </button>
                <p className="px-1.5" onClick={(e) => e.preventDefault()}>
                  {totalQty}
                </p>

                <button
                  className="pl-1 font-semibold"
                  onClick={(e) => handleQuantityChange(e, "inc")}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                className="text-xs font-semibold text-orange-300"
                onClick={(e) => onAddClick(e)}
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

const ItemRow = ({
  item,
  currentItem,
  onAddClick,
  handleQuantityChange,
}: {
  item: MenuItemI
  currentItem?: Cart
  onAddClick: (e: MouseEvent<HTMLElement>) => void
  handleQuantityChange: (
    e: MouseEvent<HTMLElement>,
    operation: "inc" | "dec"
  ) => void
}) => {
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
        <div className="min-w-20 text-right">
          <p className="text-base font-bold">{item.PriceItemMap?.[0].price}</p>
          {currentItem?.quantity ? (
            <div className="flex items-center justify-end">
              <button
                className="px-1 font-semibold"
                onClick={(e) => handleQuantityChange(e, "dec")}
              >
                <Minus size={14} />
              </button>
              <p className="px-1.5" onClick={(e) => e.preventDefault()}>
                {currentItem.quantity}
              </p>
              <button
                className="pl-1 font-semibold"
                onClick={(e) => handleQuantityChange(e, "inc")}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="text-xs font-semibold text-orange-300"
              onClick={(e) => onAddClick(e)}
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
