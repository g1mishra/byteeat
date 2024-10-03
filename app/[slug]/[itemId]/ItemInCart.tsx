"use client"

import { FetchMenuItemResponse, PriceItemMapI } from "@/services/menuService"
import { Minus, Plus } from "lucide-react"

import { useCart } from "@/app/store/CartProvider"
import { Button } from "@/components/ui/button"
import { Cart } from "@/lib/types"

const ItemInCart = ({
  response,
}: {
  response: FetchMenuItemResponse
}) => {
  const { cart, setCart } = useCart()((state) => state)

  if (!response?.PriceItemMap) return null

  const mappedData = response?.PriceItemMap?.map((priceItem: PriceItemMapI) => {
    return {
      id: response.id,
      name: response.dish,
      price: priceItem.price || 0,
      portion: priceItem.portion || null,
      quantity:
        cart[
          priceItem.portion
            ? `${response.id}-${priceItem.portion}`
            : (response.id as string)
        ]?.quantity || 0,
    }
  })

  const handleCartUpdate = (item: Cart, operation: "inc" | "dec") => {
    setCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        portion: item.portion,
        addons: item.addons || [],
      },
      operation
    )
  }

  const handleAddonToggle = (item: Cart, addon: any) => {
    const cartKey = item.portion ? `${item.id}-${item.portion}` : item.id
    const currentItem = cart[cartKey] || { quantity: 0, addons: [] }
    const updatedAddons = currentItem.addons.includes(addon.id)
      ? currentItem.addons.filter((id: string) => id !== addon.id)
      : [...currentItem.addons, addon.id]

    setCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: currentItem.quantity,
        portion: item.portion,
        addons: updatedAddons,
      },
      "update"
    )
  }

  return (
    <div className="mb-4 flex flex-col items-start justify-between space-y-4">
      {mappedData.map((item: any, index: number) => (
        <div
          key={index}
          className="flex w-full items-center justify-between border-b p-1"
        >
          <div className="flex flex-col">
            <div className="text-muted-foreground">
              {item.portion ? `${item.name} - ${item.portion}` : item.name}
            </div>
            <div className="text-base font-bold text-gray-800">
              ₹{item.price}
            </div>
          </div>
          <div className="bg-secondary text-primary flex items-center space-x-2 rounded-lg border">
            {item.quantity ? (
              <>
                <button
                  className="px-3 py-2"
                  onClick={() => handleCartUpdate(item, "dec")}
                >
                  <Minus size={16} />
                </button>
                <span className="text-base font-medium">{item.quantity}</span>
                <button
                  className="px-3 py-2"
                  onClick={() => handleCartUpdate(item, "inc")}
                >
                  <Plus size={16} />
                </button>
              </>
            ) : (
              <Button
                className="w-24 rounded-lg px-4 py-2 text-white"
                onClick={() =>
                  handleCartUpdate({ ...item, quantity: 1 }, "inc")
                }
              >
                Add
              </Button>
            )}
          </div>
          {item?.addons && item?.addons?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Addons:</p>
              {item?.addons?.map((addon: any) => (
                <div key={addon.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`addon-${addon.id}`}
                    checked={cart[item.id]?.addons?.includes(addon.id) || false}
                    onChange={() => handleAddonToggle(item, addon)}
                    className="mr-2"
                  />
                  <label htmlFor={`addon-${addon.id}`} className="text-sm">
                    {addon.name} - ₹{addon.price}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ItemInCart