"use client"

import { useCallback, useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ItemsToRender } from "./type"

export default function MenuPopover({
  itemsToRender,
}: {
  itemsToRender: ItemsToRender[]
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const isLargeScreen = useMediaQuery("(min-width: 640px)")

  const handleCategoryClick = useCallback((categoryId: string) => {
    const el = document.getElementById(categoryId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setIsPopoverOpen(false)
  }, [])

  if (itemsToRender.length === 0) return null

  return (
    <div
      className={cn(
        "text-primary fixed bottom-5 flex max-w-max justify-center",
        {
          "right-[calc(50%-310px)]": isLargeScreen,
          "right-2.5": !isLargeScreen,
        }
      )}
    >
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 48 48"
            className="cursor-pointer"
          >
            <g data-name="Group 3" transform="translate(-312 -609)">
              <circle
                data-name="Ellipse 11"
                cx="24"
                cy="24"
                r="24"
                transform="translate(312 609)"
                fill="currentColor"
              />
              <path
                data-name="Path 19674"
                d="M333.429 621.028v17.566h-.04v5.945a.453.453 0 0 1-.453.453h-.905a.453.453 0 0 1-.453-.453v-5.945H328.2v-.223a33.5 33.5 0 0 1 1.122-8.634 27.7 27.7 0 0 1 2.865-6.506 24 24 0 0 1 1.242-2.203"
                fill="#fff"
              />
              <path
                data-name="Path 19675"
                d="M343.8 621.461v8.148a.45.45 0 0 1-.453.452h-2.263v14.479a.45.45 0 0 1-.452.453h-.906a.453.453 0 0 1-.452-.453v-14.479h-2.263a.45.45 0 0 1-.453-.452v-8.148a.453.453 0 0 1 .452-.453h.453a.453.453 0 0 1 .452.453v7.25h1.587v-7.243a.453.453 0 0 1 .446-.453h.459a.45.45 0 0 1 .318.133.45.45 0 0 1 .128.32v7.243h1.588v-7.243a.453.453 0 0 1 .453-.453h.453a.45.45 0 0 1 .453.446"
                fill="#fff"
              />
            </g>
          </svg>
        </PopoverTrigger>
        <PopoverContent align={"end"} className="min-w-52 max-w-max p-1.5">
          <div className="grid gap-4">
            {itemsToRender.map((category) => (
              <div
                key={"goto-" + category.id}
                onClick={() => handleCategoryClick(category.id.toString())}
                className="cursor-pointer rounded-md px-3 py-1.5 hover:bg-gray-200"
              >
                <h3 className="text-base font-bold capitalize">
                  {category?.categoryName} - ({category?.Item?.length})
                </h3>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
