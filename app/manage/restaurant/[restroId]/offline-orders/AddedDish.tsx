"use client"

import { useState } from "react"
import { MenuItemI } from "@/services/menuService"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddedDishProps = {
  addedDishes: MenuItemI[]
  onRemove: (id: string) => void
  onSelect: (portion: string, dish: MenuItemI | null) => void
}

type DishWithQuantity = {
  id: string
  uniqueId: string
  quantity: number
  portion: string
  price: number
  dish: string
}

export default function AddedDish({ onRemove, onSelect, addedDishes }: AddedDishProps) {
  const [discount, setDiscount] = useState(0)

  const dishesWithQuantity: DishWithQuantity[] = addedDishes.reduce<
    DishWithQuantity[]
  >((acc, item) => {
    item.PriceItemMap!.forEach((priceItem) => {
      const uniqueId = `${item.id}-${priceItem.portion}`
      const existingItem = acc.find((obj) => obj.uniqueId === uniqueId)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        acc.push({
          id: item.id,
          uniqueId: uniqueId,
          quantity: 1,
          portion: priceItem.portion,
          price: priceItem.price,
          dish: item.dish,
        })
      }
    })

    return acc
  }, [])

  const totalPrice =
    dishesWithQuantity.reduce(
      (total, dish) => total + dish.price * dish.quantity,
      0
    ) *
    (1 - Math.min(discount, 100) / 100)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Added Dishes</h2>
      <ul className="grid grid-cols-1 gap-4">
        {dishesWithQuantity.map((dish) => (
          <li
            key={dish.uniqueId}
            className="bg-gray-100 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium">{dish.dish}</h3>
              <p className="text-gray-500">₹{dish.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                // onClick={() => setQuantity(quantity - 1)}
                disabled={dish.quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium">{dish.quantity}</div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  onSelect(dish.portion, addedDishes.find((d) => d.id === dish.id)|| null )
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 grid gap-2 justify-end">
        <Label htmlFor="discount">Discount</Label>
        <div className="flex items-center gap-2 mr-auto text-right">
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24"
          />
          <span>%</span>
        </div>
      </div>
      <div className="mt-4 text-right">
        <p className="text-lg font-medium">Total: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  )
}
