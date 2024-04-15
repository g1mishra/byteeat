"use client"

import { MenuItemI } from "@/services/menuService"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WithUpdateMenuDialog } from "@/components/manage/update-menu"

const MenuList = ({
  menu,
  restroId,
}: {
  menu: {
    id: string
    categoryName: string
    Item: MenuItemI[]
  }
  restroId: string
}) => {
  console.log("Menu => ", menu)
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        className="border-b-15 mt-4 px-2 first:mt-0"
        id={String(menu.id)}
        value={String(menu.id)}
      >
        <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
          {menu.categoryName} ({menu.Item.length})
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-y-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {menu.Item.map((item) => (
              <WithUpdateMenuDialog
                key={item.id}
                itemData={{
                  ...item,
                  priceMap: [],
                  categoryId: menu.id,
                  category: menu.categoryName,
                  description: item.description || "",
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{item.dish}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </WithUpdateMenuDialog>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default MenuList
