"use client"

import { useState } from "react"
import { MenuItemI } from "@/services/menuService"
import { Prisma } from "@prisma/client"

import AddedDish from "./AddedDish"
import DishList from "./DishList"
import SelectPortionModal from "./SelectPortionModal"

const restaurantInclude = Prisma.validator<Prisma.RestaurantInclude>()({
  ItemCategory: {
    select: {
      id: true,
      Item: { include: { PriceItemMap: true } },
      categoryName: true,
    },
  },
  SocialLinks: true,
  joiningKey: true,
})

type Restaurant = Prisma.RestaurantGetPayload<{
  include: typeof restaurantInclude
}>

type OrdersProps = {
  restaurant: Restaurant
}

export default function Orders({ restaurant }: OrdersProps) {
  const [addedDishes, setAddedDishes] = useState<MenuItemI[]>([])
  const [dishToAdd, setDishToAdd] = useState<MenuItemI | null>(null)

  console.log("selectedDishes", addedDishes)

  function handleAddDish(dish: MenuItemI) {
    if (dish.PriceItemMap?.length && dish.PriceItemMap.length > 1) {
      setDishToAdd(dish)
    } else {
      setAddedDishes([...addedDishes, dish])
    }
  }

  function handleRemoveDish(id: string) {
    setAddedDishes(addedDishes.filter((dish) => dish.id !== id))
  }

  function handleAddDishWithPortion(portion: string, dish: MenuItemI) {
    console.log('portion', portion, 'dish', dish)
    const priceItem = dish.PriceItemMap?.find(
      (item) => item.portion === portion
    )

    if (priceItem) {
      const dishToAdd = { ...dish, PriceItemMap: [priceItem] }
      setAddedDishes([...addedDishes, dishToAdd])
    }

    if (!!dishToAdd) setDishToAdd(null)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Dishes</h2>
        {restaurant.ItemCategory.map((menu) => (
          <DishList
            key={menu.id + menu.Item[0].PriceItemMap[0].portion}
            menu={menu}
            onSelect={handleAddDish}
          />
        ))}
      </div>
      <AddedDish
        addedDishes={addedDishes}
        onRemove={handleRemoveDish}
        onSelect={(portion: string, dish: MenuItemI | null) =>
          !!dish && handleAddDishWithPortion(portion, dish)
        }
      />
      {!!dishToAdd && (
        <SelectPortionModal
          dish={dishToAdd}
          open={!!dishToAdd}
          close={() => setDishToAdd(null)}
          addDish={handleAddDishWithPortion}
        />
      )}
    </>
  )
}
