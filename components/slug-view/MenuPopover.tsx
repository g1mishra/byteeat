import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "../ui/button"
import { ItemsToRender } from "./type"

export function MenuPopover({
  itemsToRender,
}: {
  itemsToRender: ItemsToRender[]
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full bg-white" variant="outline">
          Browse menu
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1.5">
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
              className="cursor-pointer rounded-md px-3 py-1.5 hover:bg-gray-200"
            >
              <h3 className="text-base font-bold capitalize">
                {category.categoryName} - ({category.Item.length})
              </h3>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
