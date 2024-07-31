"use client"

import dynamic from "next/dynamic"
import { MenuItemI } from "@/services/menuService"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import VegOrNonVeg from "@/components/veg-or-nonveg"

const WithUpdateMenuDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-update-item"),
  { ssr: false }
)

const MenuCardList = ({
  menu,
  slug,
}: {
  menu: {
    id: string
    categoryName: string
    Item: MenuItemI[]
  }
  slug: string
}) => {
  return (
    <Accordion
      defaultValue={String(menu.id)}
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem
        className="mt-4 first:mt-0"
        id={String(menu.id)}
        value={String(menu.id)}
      >
        <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
          {menu?.categoryName} ({menu?.Item?.length})
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-y-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {menu?.Item?.map((item) => (
              <WithUpdateMenuDialog
                key={item.id}
                itemData={{
                  ...item,
                  categoryId: menu.id,
                  category: menu.categoryName,
                  description: item.description || "",
                  PriceItemMap: item.PriceItemMap || [],
                }}
                restaurantSlug={slug}
              >
                <Card className="flex h-full flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-x-1 text-base">
                      {item.type === "FOOD" ? (
                        <VegOrNonVeg
                          className="shrink-0 scale-90"
                          isVeg={item.isVeg}
                        />
                      ) : null}
                      {item.dish}{" "}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                    <div className="mt-2">
                      {item?.PriceItemMap?.map((price) => (
                        <div key={price.id}>
                          {!price.portion ? (
                            <strong>₹ {price.price}</strong>
                          ) : (
                            <span>
                              {price.portion} : <strong>₹ {price.price}</strong>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  <div className="mt-auto">
                    <Button className="w-full rounded-none" variant="secondary">
                      Edit
                    </Button>
                  </div>
                </Card>
              </WithUpdateMenuDialog>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default MenuCardList
