"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { MenuItemI, PriceItemMapI } from "@/services/menuService"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import SearchAndFilter from "../search-filter"
import { Separator } from "../ui/separator"
import Cart from "./Cart"
import MenuItem from "./MenuItem"
import { MenuPopover } from "./MenuPopover"
import { ItemsForOrder, ItemsToRender } from "./type"

const getLowestPrice = (data: PriceItemMapI[]) => {
  if (!data) return -1
  if (data.length === 1) return -1
  return data.reduce((acc, curr) => {
    if (acc.price > curr.price) {
      return curr
    }
    return acc
  }).price
}

type MenuViewProps = {
  data: ItemsToRender[]
  tableNo: number
  restaurantId?: string | undefined
}

const MenuView: React.FC<MenuViewProps> = ({ data, tableNo }) => {
  const [filters, setFilters] = useState({
    isFood: true,
    searchValue: "",
  })

  const [cart, setCart] = useState<ItemsForOrder[]>([])

  const { food: foodItems, bar: barItems } = useMemo(
    () =>
      data.reduce(
        (acc, menu) => {
          if (!menu.Item) return acc
          const foodOrBar = menu?.Item[0]?.foodOrBar ? "food" : "bar"
          acc[foodOrBar].push(menu)
          return acc
        },
        {
          food: [] as ItemsToRender[],
          bar: [] as ItemsToRender[],
        }
      ),
    [data]
  )

  const itemsToRender = useMemo(() => {
    const applyFilter = () => {
      let items = filters.isFood ? [...foodItems] : [...barItems]
      let q = filters.searchValue.trim().toLowerCase()
      if (q === "") {
        return items
      }
      const filteredItems = items.map((category) => {
        const filteredItems = category?.Item?.filter((item) =>
          item.dish.toLowerCase().includes(q.toLowerCase())
        )
        return { ...category, Item: filteredItems }
      })

      return filteredItems
    }
    return applyFilter()
  }, [filters, foodItems, barItems])
  return (
    <div className="mt-2 flex flex-col content-center">
      <Separator className="mb-2 mt-4" />
      <SearchAndFilter filters={filters} setFilters={setFilters} />
      <Separator className="mb-4 mt-2" />
      {itemsToRender.map((category) => (
        <Accordion
          key={String(category.id)}
          defaultValue={String(category.id)}
          collapsible
          type="single"
          className="w-full "
        >
          <AccordionItem
            className="mt-4 border-none first:mt-0"
            id={String(category.id)}
            value={String(category.id)}
          >
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {category.categoryName} - ({category?.Item?.length})
            </AccordionTrigger>

            <AccordionContent className="grid gap-6">
              {category?.Item?.map((item) => {
                const imgPath = item?.imgPath?.trim()
                const images = imgPath ? imgPath.split(";") : []
                return (
                  <MenuItem
                    key={item.id}
                    item={item}
                    images={images}
                    showAddToCart={tableNo > 0}
                    lowestPrice={getLowestPrice(
                      item.PriceItemMap as PriceItemMapI[]
                    )}
                  />
                )
              })}
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
