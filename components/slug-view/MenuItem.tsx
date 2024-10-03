"use client"

import { memo, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MenuItemI } from "@/services/menuService"

import { cn } from "@/lib/utils"
import { useCart } from "@/app/store/CartProvider"

import VegOrNonVeg from "../veg-or-nonveg"
import {
  OrderCustomizationModalEditMeta,
  OrderCustomizationModalVariant,
} from "./OrderCustomizationModal"
import OrderCustomizationRepeat from "./OrderCustomizationRepeat"
import OrderItemQuantityAdjuster from "./OrderItemQuantityAdjuster"
import { QuantityControlAction, changeItemQuantity } from "./util"

const OrderCustomizationModal = dynamic(() => import("./OrderCustomizationModal"), {
  ssr: false,
})

interface MenuItemProps {
  item: MenuItemI
  quantity: number
  image?: string
  className?: string
}

const MenuItem = memo(({ item, quantity, image, className = "" }: MenuItemProps) => {
  const params = useParams()
  const setCart = useCart()((state) => state.setCart)
  const [isOrderCustomizationModalOpen, setIsOrderCustomizationModalOpen] = useState(false)
  const [variant, setVariant] = useState<OrderCustomizationModalVariant>("compact")
  const [editMeta, setEditMeta] = useState<OrderCustomizationModalEditMeta | undefined>(undefined)
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false)
  const [repeatVariant, setRepeatVariant] = useState<QuantityControlAction>(
    QuantityControlAction.INCREMENT
  )

  const openOrderCustomizationModal = useCallback(
    (variant: OrderCustomizationModalVariant = "compact") => {
      setVariant(variant)
      setIsOrderCustomizationModalOpen(true)
    },
    [setVariant, setIsOrderCustomizationModalOpen]
  )

  const handleEditCustomization = useCallback(
    (editMeta: OrderCustomizationModalEditMeta) => {
      setEditMeta(editMeta)
      setIsRepeatModalOpen(false)
      openOrderCustomizationModal("compact")
    },
    [openOrderCustomizationModal]
  )

  const handleNewCustomization = useCallback(() => {
    setIsRepeatModalOpen(false)
    openOrderCustomizationModal("expanded")
  }, [openOrderCustomizationModal])

  const handleQuantityChange = useCallback(
    (action: QuantityControlAction) => {
      if ((item.PriceItemMap && item.PriceItemMap.length > 1) || item.addons?.length) {
        if (action === QuantityControlAction.INCREMENT && !quantity) {
          openOrderCustomizationModal("compact")
        } else {
          setIsRepeatModalOpen(true)
          setRepeatVariant(action)
        }
      } else {
        changeItemQuantity(
          {
            id: item.id,
            name: item.dish,
            price: item.PriceItemMap?.[0].price || 0,
            portion: item.PriceItemMap?.[0].portion || "",
          },
          setCart
        )(
          action === QuantityControlAction.INCREMENT
            ? QuantityControlAction.INCREMENT
            : QuantityControlAction.DECREMENT
        )
      }
    },
    [item, openOrderCustomizationModal, setCart, quantity]
  )

  const Content = image ? ItemCard : ItemRow

  return (
    <div className={cn("relative [&_.hr-line]:last:hidden [&_div]:last:mb-0", className)}>
      <Content
        item={item}
        quantity={quantity}
        image={image}
        slug={params.slug as string}
        onOpenModal={openOrderCustomizationModal}
        onQuantityChange={handleQuantityChange}
      />
      {isOrderCustomizationModalOpen && (
        <OrderCustomizationModal
          variant={variant}
          item={item}
          open={isOrderCustomizationModalOpen}
          setOpen={(flag) => {
            setIsOrderCustomizationModalOpen(flag)
            if (!flag) {
              setEditMeta(undefined)
            }
          }}
          editMeta={editMeta}
        />
      )}
      {isRepeatModalOpen && (
        <OrderCustomizationRepeat
          item={item}
          variant={repeatVariant}
          isOpen={isRepeatModalOpen}
          setOpen={setIsRepeatModalOpen}
          onEditCustomization={handleEditCustomization}
          onAddNewCustomization={handleNewCustomization}
        />
      )}
    </div>
  )
})

MenuItem.displayName = "MenuItem"
export default MenuItem

const ItemCard = memo(
  ({
    item,
    quantity,
    image,
    slug,
    onOpenModal,
    onQuantityChange,
  }: {
    item: MenuItemI
    quantity: number
    image?: string
    slug: string
    onOpenModal: (variant?: OrderCustomizationModalVariant) => void
    onQuantityChange: (action: QuantityControlAction) => void
  }) => {
    if (!item?.id) return null

    return (
      <div className="overflow-hidden rounded border bg-slate-100/50">
        <div className="flex">
          {image ? (
            <Image
              loading="lazy"
              src={image}
              alt={item.dish}
              className="w-1/2 rounded-l object-cover sm:w-1/3 sm:object-cover"
              width={500}
              height={500}
              quality={100}
              onClick={() => onOpenModal("expanded")}
            />
          ) : null}
          <div className="flex w-1/2 flex-col gap-1 p-4 sm:w-2/3">
            <div className="w-full flex-1 self-start">
              <div
                className="flex items-center justify-between"
                onClick={() => onOpenModal("expanded")}
              >
                <h3 className="text-base font-medium">{item.dish}</h3>
                {item.type === "FOOD" && <VegOrNonVeg isVeg={item.isVeg} />}
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{item.description}</p>
            </div>

            <div className="flex min-w-28 shrink-0 flex-col items-end self-end text-right">
              <p className="mb-1 text-sm font-medium">₹{item.PriceItemMap?.[0]?.price}</p>
              <OrderItemQuantityAdjuster
                quantity={quantity}
                className="-mr-3"
                addBtnClassName="pr-0"
                onQuantityChange={onQuantityChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ItemCard.displayName = "ItemCard"

const ItemRow = memo(
  ({
    item,
    quantity,
    slug,
    onOpenModal,
    onQuantityChange,
  }: {
    item: MenuItemI
    quantity: number
    slug: string
    onOpenModal: (variant?: OrderCustomizationModalVariant) => void
    onQuantityChange: (action: QuantityControlAction) => void
  }) => {
    if (!item?.id) return null

    return (
      <div className="mb-2 flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-1">
          <div className="max-w-[95%] flex-1 self-start">
            <h3
              className="flex items-center gap-1 text-base font-medium"
              onClick={() => onOpenModal("expanded")}
            >
              {item.type === "FOOD" && <VegOrNonVeg isVeg={item.isVeg} />}
              {item.dish}
            </h3>
            <p className="line-clamp-3 text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="flex min-w-28 shrink-0 flex-col items-end self-end text-right">
            <p className="mb-1 pr-4 text-sm font-medium">₹{item.PriceItemMap?.[0]?.price}</p>
            <OrderItemQuantityAdjuster quantity={quantity} onQuantityChange={onQuantityChange} />
          </div>
        </div>
        <div
          className={cn("hr-line mt-0.5 border-b border-[#ededed]", {
            "mt-0": !item.description,
          })}
        />
      </div>
    )
  }
)

ItemRow.displayName = "ItemRow"
