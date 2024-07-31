"use client"

import { useMemo, useState } from "react"
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

const MenuPopover = dynamic(() => import("./MenuPopover"), { ssr: false })

type MenuViewProps = {
  data: ItemsToRender[]
  restaurantId?: string | undefined
}

const MenuView: React.FC<MenuViewProps> = ({ data }) => {
  const [filters, setFilters] = useState({
    isFood: true,
    searchValue: "",
  })

  const { food: foodItems, bar: barItems } = useMemo(
    () =>
      data.reduce(
        (acc, menu) => {
          if (!menu.Item) return acc
          const itemType = menu?.Item[0]?.type === "FOOD" ? "food" : "bar"
          acc[itemType].push(menu)
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
      <Accordion
        defaultValue={itemsToRender.map((category) => String(category.id))}
        type="multiple"
        className="w-full "
      >
        {itemsToRender.map((category) => (
          <AccordionItem
            key={category.id}
            className="border-b first:mt-0 last:border-none"
            id={String(category.id)}
            value={String(category.id)}
          >
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {category.categoryName}
            </AccordionTrigger>

            <AccordionContent className="grid gap-4">
              {category?.Item?.map((item) => {
                const imgPath = item?.imgPath?.trim()
                const images = imgPath ? imgPath.split(";") : []

                if (images.length > 0) {
                  return (
                    <MenuItem key={item.id} item={item} image={images[0]} />
                  )
                }
                return <MenuItem key={item.id} item={item} />
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <MenuPopover itemsToRender={itemsToRender} />
    </div>
  )
}

export default MenuView
