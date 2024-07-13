"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
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

import SearchAndFilter from "./search-filter"
import { Separator } from "./ui/separator"
import VegOrNonVeg from "./veg-or-nonveg"

const getLowestPrice = (data: PriceItemMapI[]) => {
  if (!data) return "N/A"
  return data.reduce((acc, curr) => {
    if (acc.price > curr.price) {
      return curr
    }
    return acc
  }).price
}

type PropsData = {
  id: string
  categoryName: string
  Item: MenuItemI[]
}

const MenuView = ({ data }: { data: PropsData[] }) => {
  const [filters, setFilters] = useState({
    isFood: true,
    searchValue: "",
  })

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

  const itemsToRender = useMemo(() => {
    const applyFilter = () => {
      let items = filters.isFood ? [...foodItems] : [...barItems]
      let q = filters.searchValue.trim().toLowerCase()
      if (q === "") {
        return items
      }
      const filteredItems = items.map((category) => {
        const filteredItems = category.Item.filter((item) =>
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
              {category.categoryName} - ({category.Item.length})
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-y-4 p-0 ">
              {category.Item.map((item) => {
                const imgPath = item?.imgPath?.trim()
                const images = imgPath ? imgPath.split(";") : []
                return (
                  <AccordionContent
                    className="flex flex-col border-b border-gray-200 pb-3"
                    key={item.id}
                  >
                    <div className="flex items-center justify-between gap-2 ">
                      <h2 className="flex w-8/12 items-start text-base font-semibold text-gray-700">
                        {item.foodOrBar ? (
                          <VegOrNonVeg
                            className="mr-1.5 mt-1 shrink-0 scale-75"
                            isVeg={item.isVeg}
                          />
                        ) : null}
                        {item.dish}
                      </h2>
                      <span className="block w-4/12 shrink-0 text-right">
                        <ul>
                          {item.PriceItemMap?.map((price) => (
                            <li>
                              {price.portion != ""
                                ? `${price.portion} - ${price.price}`
                                : `${price.price}`}
                            </li>
                          ))}
                        </ul>
                      </span>
                    </div>

                    <div className="mt-1 text-justify">
                      {images?.length ? (
                        <>
                          <div className="mb-1 flex gap-1 overflow-hidden">
                            {images.map((img, i) => (
                              <div key={img} className={cn("relative size-32")}>
                                <Image
                                  src={img}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                  alt={item.dish}
                                />
                              </div>
                            ))}
                          </div>

                          <span className="line-clamp-3 text-sm text-gray-600">
                            {item.description}
                          </span>
                        </>
                      ) : (
                        <span className="line-clamp-3 text-sm text-gray-600">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </AccordionContent>
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
