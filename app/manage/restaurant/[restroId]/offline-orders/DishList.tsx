"use client"

import { MenuItemI } from "@/services/menuService"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import VegOrNonVeg from "@/components/veg-or-nonveg"

const DishList = ({
  menu,
  onSelect,
}: {
  menu: {
    id: string
    categoryName: string
    Item: MenuItemI[]
  }
  onSelect: (item: MenuItemI) => void
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {menu.Item.map((item) => (
        <Card className="flex h-full flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-x-1 text-base">
              {item.type === "FOOD" ? (
                <VegOrNonVeg className="shrink-0 scale-90" isVeg={item.isVeg} />
              ) : null}
              {item.dish}{" "}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
            <div className="mt-2">
              {item?.PriceItemMap?.map((price) => (
                <div key={price.id}>
                  {!price.portion ? (
                    <strong>₹ {price.price.toString()}</strong>
                  ) : (
                    <span>
                      {price.portion} :{" "}
                      <strong>₹ {price.price.toString()}</strong>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          <div className="mt-auto">
            <Button
              className="w-full rounded-none"
              variant="secondary"
              onClick={() => onSelect(item)}
            >
              Add
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default DishList
