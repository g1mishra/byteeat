"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import dynamic from "next/dynamic"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { ThemeFormValues } from "../manage/RestaurantTheme"
import SearchAndFilter from "../search-filter"
import { Separator } from "../ui/separator"
import MenuItem from "./MenuItem"
import { ItemsToRender } from "./type"
import { useTotalQty } from "./util"

const MenuPopover = dynamic(() => import("./MenuPopover"), { ssr: false })

interface MenuViewProps {
  data: any
  selfOrdering: boolean
  theme: Omit<ThemeFormValues, "backgroundColor">
}

const MenuView = ({ data, selfOrdering, theme }: MenuViewProps) => {
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
      data.forEach((menu: any) => {
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
      isSearchActive: prev.searchValue.trim().length > 0,
    }))
  }, [foodItems.length, barItems.length])

  const getButtonClasses = () => {
    switch (theme.buttonStyle) {
      case "pill":
        return "rounded-full"
      case "square":
        return "rounded-none"
      default:
        return "rounded-md"
    }
  }

  const getLayoutClasses = () => {
    switch (theme.menuStyle) {
      case "list":
        return "flex flex-col gap-4"
      case "compact":
        return "grid grid-cols-1 gap-2"
      default:
        return "grid grid-cols-1 gap-2"
    }
  }

  return (
    <div className={getLayoutClasses()}>
      <SearchAndFilter filters={filters} setFilters={setFilters} theme={theme} />
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
                <AccordionTrigger
                  className="text-lg font-bold capitalize !no-underline"
                  style={{ color: theme.primaryColor }}
                >
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
                      theme={theme}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
      </Accordion>
      <MenuPopover itemsToRender={itemsToRender} theme={theme} />
    </div>
  )
}

export default React.memo(MenuView)
