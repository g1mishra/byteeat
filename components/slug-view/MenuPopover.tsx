"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useMediaQuery from "@/hook/useMediaQuery"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useCallback, useState } from "react"

import { ItemsToRender } from "./type"

interface MenuPopoverProps {
  itemsToRender: any[]
  theme?: {
    buttonStyle: "rounded" | "square" | "pill"
    primaryColor: string
    secondaryColor: string
  }
}

export default function MenuPopover({ itemsToRender, theme }: MenuPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const isLargeScreen = useMediaQuery("(min-width: 640px)")

  const buttonClasses =
    theme?.buttonStyle === "pill"
      ? "rounded-full"
      : theme?.buttonStyle === "square"
        ? "rounded-none"
        : "rounded-md"

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
      className={cn("fixed bottom-5 flex max-w-max justify-center text-primary", {
        "right-[calc(50%-310px)]": isLargeScreen,
        "right-2.5": !isLargeScreen,
      })}
    >
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            className={`fixed bottom-4 right-4 ${buttonClasses}`}
            style={{
              backgroundColor: theme?.primaryColor,
              color: theme?.secondaryColor,
            }}
          >
            <Menu className="mr-2 size-4" />
            Menu
          </Button>
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
