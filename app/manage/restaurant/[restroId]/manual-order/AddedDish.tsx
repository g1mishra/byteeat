"use client"

import { Fragment, useState } from "react"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Cart } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddedDishProps = {
  addedDishes: Cart[]
  onRemove: (id: string, portion?: string) => void
  onAdd: (dish: Cart, action: "INC" | "DEC") => void
  discount: number
  setDiscount: (discount: number) => void
  totalPrice: number
  subtotalPrice: number
}

export default function AddedDish({
  onRemove,
  onAdd,
  addedDishes,
  discount,
  setDiscount,
  totalPrice,
  subtotalPrice,
}: AddedDishProps) {
  const handleRemove = (dish: Cart) => {
    onRemove(dish.id, dish.portion)
  }

  const handleAdd = (dish: Cart) => {
    onAdd(dish, "INC")
  }

  const decrementQuantity = (dish: Cart) => {
    onAdd(dish, "DEC")
  }

  return (
    <Fragment>
      <h2 className="mb-4 text-2xl font-bold">Added Dishes</h2>
      <ul className="grid grid-cols-1 gap-4">
        {addedDishes.map((dish) => (
          <li
            key={`${dish.id}-${dish.portion}`}
            className="flex items-center justify-between rounded-lg bg-gray-100 p-4"
          >
            <div>
              <h3 className="text-base font-medium">{dish.name}</h3>
              {dish.portion !== "Default" && (
                <p className="text-sm text-gray-600">{dish.portion}</p>
              )}
              <p className="text-gray-500">₹{dish.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                className="size-8"
                variant="outline"
                onClick={() => decrementQuantity(dish)}
                disabled={dish.quantity === 1}
              >
                <MinusIcon className="size-4" />
              </Button>

              <div className="text-base font-medium">{dish.quantity}</div>
              <Button
                size="icon"
                className="size-8"
                variant="outline"
                onClick={() => handleAdd(dish)}
              >
                <PlusIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                className="size-8"
                variant="outline"
                onClick={() => handleRemove(dish)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between">
        <Label htmlFor="discount" className="text-sm">
          Discount (%)
        </Label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-20 text-right"
        />
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="text-sm">₹{subtotalPrice.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Discount:</span>
          <span className="text-sm">-₹{(subtotalPrice - totalPrice).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between font-bold">
          <span>Total:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </Fragment>
  )
}
