"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useCart } from "@/app/store/CartProvider"

import SearchAndFilter from "../search-filter"
import { Separator } from "../ui/separator"
import MenuItem from "./MenuItem"
import { ItemsToRender } from "./type"
import { useTotalQty } from "./util"

const MenuPopover = dynamic(() => import("./MenuPopover"), { ssr: false })

type MenuViewProps = {
  data: ItemsToRender[]
  restaurantId?: string
  selfOrdering?: boolean
}

const MenuView: React.FC<MenuViewProps> = ({ data, selfOrdering = false }) => {
  const totalQty = useTotalQty()
  const [filters, setFilters] = useState({
    isFood: true,
    searchValue: "",
    isSearchActive: false,
  })

  const { foodItems, barItems } = useMemo(() => {
    const food: ItemsToRender[] = []
    const bar: ItemsToRender[] = []

    if (data.length) {
      data.forEach((menu) => {
        if (menu.Item && menu.Item.length > 0) {
          if (menu.Item[0].type === "BAR") {
            bar.push(menu)
          } else {
            food.push(menu)
          }
        }
      })
    }

    return { foodItems: food, barItems: bar }
  }, [data])

  const filterItems = useCallback((items: ItemsToRender[], query: string) => {
    if (!query) return items

    return items
      .map((category) => ({
        ...category,
        Item: category.Item?.filter((item) =>
          item.dish.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((category) => category.Item && category.Item.length > 0)
  }, [])

  const itemsToRender = useMemo(() => {
    const items = filters.isFood ? foodItems : barItems
    return filterItems(items, filters.searchValue.trim())
  }, [filters, foodItems, barItems, filterItems])

  useEffect(() => {
    if (!foodItems.length && barItems.length) {
      setFilters((prev) => ({ ...prev, isFood: false }))
    }
    // Update isSearchActive based on searchValue
    setFilters((prev) => ({ 
      ...prev, 
      isSearchActive: prev.searchValue.trim().length > 0 
    }))
  }, [foodItems.length, barItems.length])

  return (
    <div className="mt-2 flex flex-col content-center">
      <Separator className="mb-2 mt-4" />
      <SearchAndFilter filters={filters} setFilters={setFilters} />
      <Separator className="mb-4 mt-2" />
      <Accordion
        key={filters.isFood ? "food" : "bar"}
        defaultValue={itemsToRender.map((category) => String(category.id))}
        type="multiple"
        className="w-full"
      >
        {itemsToRender.length === 0
          ? null
          : itemsToRender?.map((category) => (
              <AccordionItem
                key={category.id}
                className="border-b first:mt-0 last:border-none"
                id={String(category.id)}
                value={String(category.id)}
              >
                <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
                  {category.categoryName}
                </AccordionTrigger>
                <AccordionContent className="grid gap-2">
                  {category.Item?.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      quantity={totalQty[item.id] || 0}
                      image={item.imgPath?.trim().split(";")[0]}
                      selfOrdering={selfOrdering}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
      </Accordion>
      <MenuPopover itemsToRender={itemsToRender} />
    </div>
  )
}

export default React.memo(MenuView)
