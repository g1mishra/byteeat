import React, { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { MenuItemI } from "@/services/menuService"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import VegOrNonVeg from "@/components/veg-or-nonveg"
import { useCart } from "@/app/store/CartProvider"

import QuantityActionButton from "../QuantityActionBtn"
import { QuantityControlAction, addonsArraysEqual, changeItemQuantity } from "./util"

export interface OrderCustomizationModalEditMeta {
  id: string
  quantity: number
  portion: string
  addons: string[]
}

export type OrderCustomizationModalVariant = "compact" | "expanded"

interface OrderCustomizationModalProps {
  item: MenuItemI
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  variant: OrderCustomizationModalVariant
  editMeta?: OrderCustomizationModalEditMeta
}

const OrderCustomizationModal: React.FC<OrderCustomizationModalProps> = ({
  item,
  open,
  setOpen,
  variant,
  editMeta,
}) => {
  const [selectedPortion, setSelectedPortion] = useState("")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const setCart = useCart()((state) => state.setCart)

  // Memoize the initial portion selection
  const initialPortion = useMemo(() => {
    return item.PriceItemMap && item.PriceItemMap.length > 1 ? item.PriceItemMap[0].portion : ""
  }, [item.PriceItemMap])

  useEffect(() => {
    setSelectedPortion(initialPortion)
  }, [initialPortion])

  useEffect(() => {
    if (quantity === 0) {
      setOpen(false)
    }
  }, [quantity, setOpen])

  useEffect(() => {
    if (editMeta?.id) {
      setSelectedPortion(editMeta?.portion || "")
      setSelectedAddons(editMeta?.addons || [])
      setQuantity(editMeta?.quantity || 1)
    }
  }, [editMeta?.id, editMeta?.portion, editMeta?.addons, editMeta?.quantity])

  // Memoize eachItemPrice calculation
  const eachItemPrice = useMemo(() => {
    const basePrice = item.PriceItemMap?.find((p) => p.portion === selectedPortion)?.price || 0
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      return total + (item.addons?.find((a) => a.id === addonId)?.price || 0)
    }, 0)
    return basePrice + addonsPrice
  }, [item.PriceItemMap, item.addons, selectedAddons, selectedPortion])

  // Memoize the updatedItem object
  const updatedItem = useMemo(
    () => ({
      id: item.id,
      name: item.dish,
      price: eachItemPrice,
      portion: selectedPortion,
      addons: selectedAddons.map((addonId) => {
        const addon = item.addons?.find((a) => a.id === addonId)
        return {
          id: addonId,
          name: addon?.name,
          price: addon?.price,
        }
      }),
    }),
    [item.id, item.dish, eachItemPrice, selectedPortion, selectedAddons, item.addons]
  )

  // Use useCallback for handleUpdateCart
  const handleUpdateCart = useCallback(() => {
    if (quantity === 0) return

    let changeInQuantity = quantity

    if (editMeta) {
      const portionChanged = selectedPortion !== editMeta.portion
      const addonsChanged = !addonsArraysEqual(selectedAddons, editMeta.addons)

      if (portionChanged || addonsChanged) {
        changeItemQuantity(
          {
            ...updatedItem,
            portion: editMeta.portion,
            addons: editMeta.addons.map((addonId) => {
              const addon = item.addons?.find((a) => a.id === addonId)
              return {
                id: addonId,
                name: addon?.name,
                price: addon?.price,
              }
            }),
          },
          setCart
        )(QuantityControlAction.DECREMENT, editMeta.quantity)

        changeInQuantity = quantity
      } else {
        changeInQuantity = quantity - editMeta.quantity
      }
    }

    if (changeInQuantity !== 0) {
      changeItemQuantity(updatedItem, setCart)(
        changeInQuantity > 0 ? QuantityControlAction.INCREMENT : QuantityControlAction.DECREMENT,
        Math.abs(changeInQuantity)
      )
    }

    setOpen(false)
  }, [
    quantity,
    editMeta,
    setOpen,
    selectedPortion,
    selectedAddons,
    updatedItem,
    setCart,
    item.addons,
  ])

  const handleOnAction = (action: QuantityControlAction) => {
    setQuantity((prev) => prev + (action === QuantityControlAction.INCREMENT ? 1 : -1))
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        hideHandle
        showCloseIcon
        className="mx-auto w-full max-w-screen-sm rounded-t-3xl"
      >
        {variant !== "expanded" && (
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center">
              {item.imgPath && (
                <Image
                  src={item.imgPath}
                  alt={item.dish}
                  width={48}
                  height={48}
                  priority
                  className="mr-3 size-12 rounded-md object-cover"
                />
              )}
              <DrawerTitle className="text-xl font-bold">{item.dish}</DrawerTitle>
            </div>
          </DrawerHeader>
        )}
        <div className="flex h-full flex-col">
          <div className="max-h-[60vh] grow overflow-y-auto p-4">
            {variant === "expanded" && (
              <>
                {item.imgPath && (
                  <Image
                    src={item.imgPath || "/placeholder.jpg"}
                    alt={item.dish}
                    width={500}
                    height={500}
                    quality={100}
                    priority
                    className="mb-4 h-48 w-full rounded-lg object-cover sm:h-64 md:h-80 lg:h-96"
                  />
                )}
                <div className="mb-4 flex items-center">
                  {item.type === "FOOD" && <VegOrNonVeg className="mr-2" isVeg={item.isVeg} />}
                  <h2 className="text-xl font-bold">{item.dish}</h2>
                </div>
                <p className="mb-4 text-sm text-gray-600">{item.description}</p>
              </>
            )}
            {item.PriceItemMap && item.PriceItemMap.length > 1 && (
              <div className="mb-4">
                <h3 className="mb-1 text-base font-semibold">Quantity</h3>
                <div className="mb-2 text-sm text-gray-600">Required • Select any 1 option</div>
                {item.PriceItemMap.map((priceItem) => (
                  <label
                    key={priceItem.portion}
                    className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-2"
                  >
                    <span className="text-sm font-medium">{priceItem.portion}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-semibold">₹{priceItem.price}</span>
                      <input
                        type="radio"
                        name="portion"
                        value={priceItem.portion}
                        checked={selectedPortion === priceItem.portion}
                        onChange={() => setSelectedPortion(priceItem.portion)}
                        className="text-primary focus:ring-primary accent-primary size-4 rounded"
                      />
                    </div>
                  </label>
                ))}
              </div>
            )}

            {item.addons && item.addons.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-1 text-base font-semibold">Add Ons</h3>
                <div className="mb-2 text-sm text-gray-600">Optional • Select any options</div>
                {item.addons.map((addon) => (
                  <label
                    key={addon.id}
                    className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-2"
                  >
                    <span className="text-sm font-medium">{addon.name}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-semibold">₹{addon.price}</span>
                      <input
                        type="checkbox"
                        value={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onChange={(e) => {
                          setSelectedAddons((prev) =>
                            e.target.checked
                              ? [...prev, addon.id]
                              : prev.filter((id) => id !== addon.id)
                          )
                        }}
                        className="text-primary focus:ring-primary size-4 rounded"
                      />
                    </div>
                  </label>
                ))}
              </div>
            )}

            {variant === "expanded" && (
              <div>
                <h3 className="mb-2 text-base font-semibold">Add a cooking request (optional)</h3>
                <textarea
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 p-2 text-sm"
                  placeholder="e.g. Don't make it too spicy"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <QuantityActionButton
                currentValue={quantity}
                onAction={handleOnAction}
                buttonSize="compact"
              />
              <Button
                onClick={handleUpdateCart}
                disabled={!quantity}
                className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm text-white"
              >
                {editMeta?.id ? "Update item" : "Add item"} ₹{eachItemPrice * quantity}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}



export default React.memo(OrderCustomizationModal)
