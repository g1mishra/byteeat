"use client"

import { useMemo, useState } from "react"

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
import { OrganizedMenu } from "@/app/[restroId]/page"

import NonVegIcon from "./icons/nonveg"
import VegIcon from "./icons/veg"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"

interface CatAndItemsProps {
  menu: OrganizedMenu
}

const CatAndItems = ({ menu }: CatAndItemsProps) => {
  const { food: foodItems, bar: barItems } = useMemo(
    () =>
      Object.keys(menu).reduce(
        (acc: { food: any; bar: any }, key: string) => {
          const items = menu[key]
          const food = items.filter((item) => item.foodOrBar)
          if (food.length > 0) {
            acc.food[key] = food
          }

          const bar = items.filter((item) => !item.foodOrBar)
          if (bar.length > 0) {
            acc.bar[key] = bar
          }

          return acc
        },
        { food: {}, bar: {} }
      ),
    [menu]
  )

  const [isFood, setIsFood] = useState(true)

  const itemsToRender = isFood ? foodItems : barItems

  return (
    <div className="mt-4 flex flex-col content-center">
      {/* <Button onClick={() => setIsFood((prev) => !prev)} className="bg-silver">
        {isFood ? "Food menu 🍔" : "Bar menu 🥂"}
      </Button> */}
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

      <Accordion type="single" collapsible className="w-full">
        {Object.keys(itemsToRender).map((category) => (
          <AccordionItem
            className="border-b-15 mt-4 px-2 first:mt-0"
            id={category.toLowerCase()}
            key={category}
            value={category}
          >
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {category} - ({itemsToRender[category].length})
            </AccordionTrigger>
            {itemsToRender[category].map((item: any) => (
              <AccordionContent className="flex flex-col gap-y-1" key={item.id}>
                {item.foodOrBar ? (
                  item.vegOrNonVeg ? (
                    <VegIcon />
                  ) : (
                    <NonVegIcon />
                  )
                ) : null}
                <h2 className="text-lg font-bold">{item.dish}</h2>
                <p className="text-sm">₹{item.price}</p>
                <p className="mt-2.5 text-sm text-opacity-75">
                  {item.description}
                </p>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>

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

export default CatAndItems

export function MenuPopover({ itemsToRender }: { itemsToRender: any }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full" variant="outline">
          Browse menu
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {Object.keys(itemsToRender).map((category) => (
            <div
              key={"goto-" + category}
              onClick={() => {
                const el = document.getElementById(category.toLowerCase())
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-200"
            >
              <h3 className="text-lg font-bold capitalize">
                {category} - ({itemsToRender[category].length})
              </h3>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
