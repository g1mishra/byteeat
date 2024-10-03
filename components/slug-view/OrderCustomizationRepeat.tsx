import React, { useCallback, useEffect } from "react"
import { MenuItemI } from "@/services/menuService"
import { ChevronRight, Plus } from "lucide-react"

import { Cart } from "@/lib/types"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import VegOrNonVeg from "@/components/veg-or-nonveg"
import { useCart } from "@/app/store/CartProvider"

import QuantityActionButton from "../QuantityActionBtn"
import { OrderCustomizationModalEditMeta } from "./OrderCustomizationModal"
import { QuantityControlAction, changeItemQuantity } from "./util"

interface OrderCustomizationRepeatProps {
  variant: "decrement" | "increment"
  item: MenuItemI
  isOpen: boolean
  setOpen: (open: boolean) => void
  onEditCustomization: (editMeta: OrderCustomizationModalEditMeta) => void
  onAddNewCustomization: () => void
}

const OrderCustomizationRepeat: React.FC<OrderCustomizationRepeatProps> = ({
  variant = "increment",
  item,
  isOpen,
  setOpen,
  onEditCustomization,
  onAddNewCustomization,
}) => {
  const setCart = useCart()((state) => state.setCart)
  const cart = useCart()((state) => state.cart)

  const selectedItems = Object.keys(cart).filter((key) => cart[key].id.includes(item.id))

  const handleQuantityChange = useCallback(
    (action: QuantityControlAction, item: Omit<Cart, "quantity">) => {
      changeItemQuantity(
        item,
        setCart
      )(
        action === QuantityControlAction.INCREMENT
          ? QuantityControlAction.INCREMENT
          : QuantityControlAction.DECREMENT
      )
    },
    [setCart]
  )

  useEffect(() => {
    if (selectedItems.length === 0) {
      setOpen(false)
    }
  }, [selectedItems, setOpen])

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent
        hideHandle
        showCloseIcon
        className="mx-auto w-full max-w-screen-sm rounded-t-3xl"
      >
        <DrawerHeader className="border-b border-gray-100 text-left text-lg font-bold">
          <DrawerTitle>Repeat last used customization?</DrawerTitle>
        </DrawerHeader>
        <div className="flex h-full flex-col p-4">
          <div className="max-h-[60vh] grow overflow-y-auto">
            {selectedItems.map((key, index) => (
              <div key={`${key}-${index}`} className="mb-4 flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start">
                    {item.type === "FOOD" && (
                      <VegOrNonVeg className="mr-3 mt-1" isVeg={item.isVeg} />
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold">{cart[key].name}</h3>
                      <p className="text-sm font-semibold">₹{cart[key].price}</p>
                      <p className="text-xs text-gray-600">
                        {cart[key].portion}
                        {cart[key].addons && cart[key].addons.length > 0 && (
                          <>, {cart[key].addons.map((addon) => addon.name).join(", ")}</>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          onEditCustomization({
                            id: key,
                            quantity: cart[key].quantity,
                            portion: cart[key].portion || "",
                            addons: cart[key].addons?.map((addon) => addon.id) || [],
                          })
                        }}
                        className="mt-1 flex items-center gap-1 text-left text-xs font-medium text-green-700"
                      >
                        Edit <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <QuantityActionButton
                    currentValue={cart[key].quantity}
                    onAction={(action) => handleQuantityChange(action, cart[key])}
                    buttonSize="compact"
                  />
                  <span className="mt-2 text-sm font-bold">
                    ₹{cart[key].price * cart[key].quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {variant === "increment" && (
            <button
              className="mt-4 flex w-full items-center justify-center rounded-md bg-green-50 py-2 text-center text-base font-medium capitalize text-green-700"
              onClick={onAddNewCustomization}
            >
              <Plus size={16} className="mr-2" />
              Add new customisation
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default OrderCustomizationRepeat
