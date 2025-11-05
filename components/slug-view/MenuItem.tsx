"use client"

import { useCart } from "@/app/store/CartProvider"
import { cn } from "@/lib/utils"
import { MenuItemI } from "@/services/menuService"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memo, useCallback, useState } from "react"

import VegOrNonVeg from "../veg-or-nonveg"
import {
  OrderCustomizationModalEditMeta,
  OrderCustomizationModalVariant,
} from "./OrderCustomizationModal"
import { QuantityControlAction, changeItemQuantity } from "./util"

const OrderCustomizationRepeat = dynamic(() => import("./OrderCustomizationRepeat"))
const OrderItemQuantityAdjuster = dynamic(() => import("./OrderItemQuantityAdjuster"))
const OrderCustomizationModal = dynamic(() => import("./OrderCustomizationModal"), {
  ssr: false,
})

interface MenuItemProps {
  item: MenuItemI
  quantity: number
  image?: string
  selfOrdering: boolean
  theme?: {
    buttonStyle: "rounded" | "square" | "pill"
    primaryColor: string
    secondaryColor: string
  }
}

const MenuItem = memo(({ item, quantity, image, selfOrdering, theme }: MenuItemProps) => {
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

  const buttonClasses =
    theme?.buttonStyle === "pill"
      ? "rounded-full"
      : theme?.buttonStyle === "square"
        ? "rounded-none"
        : "rounded-md"

  return (
    <div className={cn("relative [&_.hr-line]:last:hidden [&_div]:last:mb-0")}>
      <Content
        item={item}
        quantity={quantity}
        image={image}
        slug={params.slug as string}
        onOpenModal={openOrderCustomizationModal}
        onQuantityChange={handleQuantityChange}
        selfOrdering={selfOrdering}
        theme={theme}
      />
      {selfOrdering ? (
        <>
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
              theme={theme}
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
              theme={theme}
            />
          )}
        </>
      ) : null}
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
    selfOrdering = false,
    theme,
  }: {
    item: MenuItemI
    quantity: number
    image?: string
    slug: string
    onOpenModal: (variant?: OrderCustomizationModalVariant) => void
    onQuantityChange: (action: QuantityControlAction) => void
    selfOrdering?: boolean
    theme?: MenuItemProps["theme"]
  }) => {
    if (!item?.id) return null

    const buttonClasses =
      theme?.buttonStyle === "pill"
        ? "rounded-full"
        : theme?.buttonStyle === "square"
          ? "rounded-none"
          : "rounded-md"

    return (
      <div className={`overflow-hidden border bg-slate-100/50 ${buttonClasses}`}>
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
              onClick={() => (selfOrdering ? onOpenModal("expanded") : undefined)}
            />
          ) : null}
          <div className="flex w-1/2 flex-col gap-1 p-4 sm:w-2/3">
            <div className="w-full flex-1 self-start">
              <div
                className="flex items-center justify-between"
                onClick={() => (selfOrdering ? onOpenModal("expanded") : undefined)}
              >
                <h3 className="text-base font-medium" style={{ color: theme?.primaryColor }}>
                  {item.dish}
                </h3>
                {item.type === "FOOD" && <VegOrNonVeg isVeg={item.isVeg} />}
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{item.description}</p>
            </div>

            <div className="flex min-w-28 shrink-0 flex-col items-end self-end text-right">
              <p className={cn("text-sm font-medium", selfOrdering ? "mb-1" : "mb-0")}>
                ₹{item.PriceItemMap?.[0]?.price}
              </p>
              {selfOrdering ? (
                <OrderItemQuantityAdjuster
                  quantity={quantity}
                  className="-mr-3"
                  addBtnClassName="pr-0"
                  onQuantityChange={onQuantityChange}
                  theme={theme}
                />
              ) : null}
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
    onOpenModal,
    onQuantityChange,
    selfOrdering = false,
    theme,
  }: {
    item: MenuItemI
    quantity: number
    slug: string
    onOpenModal: (variant?: OrderCustomizationModalVariant) => void
    onQuantityChange: (action: QuantityControlAction) => void
    selfOrdering?: boolean
    theme?: MenuItemProps["theme"]
  }) => {
    if (!item?.id) return null

    return (
      <div className="mb-2 flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-1">
          <div className="max-w-[95%] flex-1 self-start">
            <h3
              className="flex items-center gap-1 text-base font-medium"
              onClick={() => (selfOrdering ? onOpenModal("expanded") : undefined)}
              style={{ color: theme?.primaryColor }}
            >
              {item.type === "FOOD" && <VegOrNonVeg isVeg={item.isVeg} />}
              {item.dish}
            </h3>
            <p className="line-clamp-3 text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="flex min-w-28 shrink-0 flex-col items-end self-end text-right">
            <p className={cn("pr-4 text-sm font-medium", selfOrdering ? "mb-1" : "mb-0")}>
              ₹{item.PriceItemMap?.[0]?.price}
            </p>
            {selfOrdering ? (
              <OrderItemQuantityAdjuster
                quantity={quantity}
                onQuantityChange={onQuantityChange}
                theme={theme}
              />
            ) : null}
          </div>
        </div>
        <div
          className={cn("hr-line mt-0.5 border-b", {
            "mt-0": !item.description,
          })}
          style={{ borderColor: theme?.primaryColor }}
        />
      </div>
    )
  }
)

ItemRow.displayName = "ItemRow"
