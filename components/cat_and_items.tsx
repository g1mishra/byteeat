"use client"

import { useMemo, useState } from "react"
import { MenuItemI, PriceItemMapI } from "@/services/menuService"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import NonVegIcon from "./icons/nonveg"
import VegIcon from "./icons/veg"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"

const ViewPrices = ({ data }: { data: PriceItemMapI[] }) => {
  if (!data) return null
  return (
    <ul>
      {data.map((price: any) => (
        <li key={price.id}>
          {price.portion != "" ? price.portion + " - " : ""} {price.price}
        </li>
      ))}
    </ul>
  )
}

type PropsData = {
  id: string
  categoryName: string
  Item: MenuItemI[]
}

const MenuView = ({ data }: { data: PropsData[] }) => {
  console.log("data=>", data)

  const { food: foodItems, bar: barItems } = useMemo(
    () =>
      data.reduce(
        (acc, menu) => {
          const foodOrBar = menu.Item[0].foodOrBar ? "food" : "bar"
          acc[foodOrBar].push(menu)
          return acc
        },
        {
          food: [] as PropsData[],
          bar: [] as PropsData[],
        }
      ),
    [data]
  )

  const [isFood, setIsFood] = useState(true)

  const itemsToRender = isFood ? foodItems : barItems

  return (
    <div className="mt-4 flex flex-col content-center">
      <Separator className="my-4" />
      <div className="flex items-center space-x-2">
        <Label htmlFor="menu-toggle">Bar menu 🥂</Label>
        <Switch
          checked={!isFood}
          onCheckedChange={() => setIsFood(!isFood)}
          id="menu-toggle"
          aria-label="Toggle between Bar and Food menus"
          className="text-base"
        />
      </div>
      <Separator className="my-4" />

      {itemsToRender.map((category) => (
        <Accordion
          key={String(category.id)}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem
            className="border-b-15 mt-4 px-2 first:mt-0"
            id={String(category.id)}
            value={String(category.id)}
          >
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {category.categoryName} - ({category.Item.length})
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-y-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {category.Item.map((item) => (
                  <AccordionContent
                    className="flex flex-col gap-y-1"
                    key={item.id}
                  >
                    
                    <span className="flex gap-2">
                      <h2 className="text-lg font-bold">{item.dish} </h2>
                      {item.foodOrBar ? (
                      item.isVeg ? (
                        "🟢"
                      ) : (
                        "🔴"
                      )
                    ) : null}
                      <ViewPrices data={item.PriceItemMap!} />
                    </span>
                    <p className="mt-2.5 text-sm text-opacity-75">
                      {item.description}
                    </p>
                  </AccordionContent>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      <div
        className={cn("fixed inset-x-0 bottom-10 flex justify-center", {
          hidden: Object.keys(itemsToRender).length === 0,
        })}
      >
        <MenuPopover itemsToRender={itemsToRender} />
      </div>
    </div>
  )
}

export default MenuView

export function MenuPopover({ itemsToRender }: { itemsToRender: PropsData[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full" variant="outline">
          Browse menu
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {itemsToRender.map((category) => (
            <div
              key={"goto-" + category}
              onClick={() => {
                const el = document.getElementById(category.id.toString())
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-200"
            >
              <h3 className="text-lg font-bold capitalize">
                {category.categoryName} - ({category.Item.length})
              </h3>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
