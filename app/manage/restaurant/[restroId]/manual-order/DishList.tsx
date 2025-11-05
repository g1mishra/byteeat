"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import VegOrNonVeg from "@/components/veg-or-nonveg"
import { Cart } from "@/lib/types"
import { MenuItemI } from "@/services/menuService"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

type DishListProps = {
  menu: {
    id: string
    categoryName: string
    Item: MenuItemI[]
  }
  onSelect: (item: Cart, action: "INC" | "DEC") => void
}

const DishList = ({ menu, onSelect }: DishListProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: string[]
  }>({})

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setQuantities({ ...quantities, [itemId]: Math.max(0, newQuantity) })
  }

  const handleAddDish = (item: MenuItemI) => {
    const quantity = quantities[item.id] || 0
    if (quantity > 0) {
      const addons = (item.addons || [])
        .filter((addon) => selectedAddons[item.id]?.includes(addon.id))
        .map((addon) => ({
          id: addon.id,
          name: addon.name,
          price: addon.price,
        }))

      const basePrice = item.PriceItemMap?.[0]?.price || 0
      const addonPrice = addons.reduce((total, addon) => total + (addon?.price || 0), 0)

      onSelect(
        {
          id: item.id,
          name: item.dish,
          price: basePrice + addonPrice,
          portion: item.PriceItemMap?.[0]?.portion,
          quantity,
          addons,
          isVeg: item.isVeg,
        },
        "INC"
      )
      setQuantities({ ...quantities, [item.id]: 0 })
      setSelectedAddons({ ...selectedAddons, [item.id]: [] })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {menu.Item.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <VegOrNonVeg isVeg={item.isVeg} className="mr-2" />
              <span className="font-semibold">{item.dish}</span>
            </div>
            <span className="font-semibold">₹{item.PriceItemMap?.[0]?.price}</span>
          </div>
          <div className="mb-4 h-10">
            {item.addons && item.addons.length > 0 ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex size-full items-center justify-between rounded-md border px-4 py-2 text-left">
                    <span className="flex items-center">
                      {selectedAddons[item.id]?.length > 0 && (
                        <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-black p-1 text-xs text-white">
                          {selectedAddons[item.id].length}
                        </span>
                      )}
                      Customize
                    </span>
                    <ChevronDown className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="space-y-2">
                    {item.addons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between rounded-md p-1 text-sm ${
                          selectedAddons[item.id]?.includes(addon.id) ? "bg-gray-100" : ""
                        }`}
                      >
                        <span>{addon.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedAddons[item.id]?.includes(addon.id)}
                          onChange={(e) => {
                            const newAddons = e.target.checked
                              ? [...(selectedAddons[item.id] || []), addon.id]
                              : selectedAddons[item.id]?.filter((id) => id !== addon.id) || []
                            setSelectedAddons({
                              ...selectedAddons,
                              [item.id]: newAddons,
                            })
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="size-full" />
            )}
          </div>
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                className="rounded-l-md border px-3 py-1"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="border-y px-3 py-1">{quantities[item.id] || 0}</span>
              <button
                onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                className="rounded-r-md border px-3 py-1"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              disabled={!quantities[item.id] || quantities[item.id] === 0}
              onClick={() => handleAddDish(item)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DishList
