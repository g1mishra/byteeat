"use client"

import { MenuItemI } from "@/services/menuService"
import { Check } from "lucide-react"

import { Cart } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import VegOrNonVeg from "@/components/veg-or-nonveg"

type DishListProps = {
  menu: {
    id: string
    categoryName: string
    Item: MenuItemI[]
  }
  onSelect: (item: Cart, action: "INC" | "DEC") => void
  addedDishes: Cart[]
}

const DishList = ({ menu, onSelect, addedDishes }: DishListProps) => {
  const isAdded = (item: MenuItemI, portion?: string) => {
    return addedDishes.some(
      (dish) => dish.id === item.id && (!portion || dish.portion === portion)
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {menu.Item.map((item) => (
        <Card key={item.id + item.dish} className="flex flex-col">
          <CardContent className="p-3">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-1 text-sm font-medium">
                  {item.type === "FOOD" && (
                    <VegOrNonVeg
                      className="size-3 shrink-0"
                      isVeg={item.isVeg}
                    />
                  )}
                  {item.dish}
                </h3>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
              {item.PriceItemMap && item.PriceItemMap.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.PriceItemMap.map((price) => (
                      <DropdownMenuItem
                        key={price.id}
                        onSelect={() =>
                          onSelect(
                            {
                              id: item.id,
                              name: item.dish,
                              price: price.price,
                              portion: price.portion,
                              quantity: 1,
                            },
                            "INC"
                          )
                        }
                        disabled={isAdded(item, price.portion)}
                      >
                        <span className="flex w-full items-center justify-between">
                          <span>
                            {price.portion}: ₹{price.price.toString()}
                          </span>
                          {isAdded(item, price.portion) && (
                            <Check className="ml-2 size-4" />
                          )}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onSelect(
                      {
                        id: item.id,
                        name: item.dish,
                        price: item?.PriceItemMap?.[0]?.price || 0,
                        portion: item?.PriceItemMap?.[0]?.portion,
                        quantity: 1,
                      },
                      "INC"
                    )
                  }
                >
                  {isAdded(item) ? (
                    <span className="flex items-center">
                      <Check className="mr-1 size-3" /> Added
                    </span>
                  ) : (
                    "Add"
                  )}
                </Button>
              )}
            </div>
            <div className="text-xs">
              {item?.PriceItemMap?.map((price, index) => (
                <span key={price.id} className="mr-2">
                  {price.portion && `${price.portion}: `}
                  <span className="font-semibold">
                    ₹{price.price.toString()}
                  </span>
                  {index < item.PriceItemMap!.length - 1 && " | "}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DishList
