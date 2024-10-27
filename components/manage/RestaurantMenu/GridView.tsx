import { MenuItemI } from "@/services/menuService"
import dynamic from "next/dynamic"

import {
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VegOrNonVeg from "@/components/veg-or-nonveg"

const WithUpdateMenuDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-update-item"),
  { ssr: false }
)

const LazyAccordion = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => ({ default: mod.Accordion }))
)
const LazyAccordionContent = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => ({ default: mod.AccordionContent }))
)

interface GridViewProps {
  filteredMenuItems: Record<
    string,
    (MenuItemI & {
      categoryName: string
    })[]
  >
  restaurantSlug: string
  restaurantId: string
}

const GridView: React.FC<GridViewProps> = ({ filteredMenuItems, restaurantSlug, restaurantId }) => {
  // Group filtered items by category

  return (
    <>
      {Object.entries(filteredMenuItems).map(([categoryName, items]) => (
        <LazyAccordion
          key={categoryName}
          defaultValue={categoryName}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem className="mt-4 first:mt-0" id={categoryName} value={categoryName}>
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {categoryName} ({items.length})
            </AccordionTrigger>

            <LazyAccordionContent className="flex flex-col gap-y-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <WithUpdateMenuDialog
                    key={item.id}
                    itemData={{
                      ...item,
                      categoryId: item.categoryId,
                      category: item.categoryName,
                      description: item.description || "",
                      PriceItemMap: item.PriceItemMap || [],
                      addons: item.addons || [],
                    }}
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                  >
                    <Card className="flex h-full flex-col justify-between">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-x-1 text-base">
                          {item.type === "FOOD" ? (
                            <VegOrNonVeg className="shrink-0 scale-90" isVeg={item.isVeg} />
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
                                <strong>₹ {price.price.toString()}</strong>
                              ) : (
                                <span>
                                  {price.portion} : <strong>₹ {price.price.toString()}</strong>
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
            </LazyAccordionContent>
          </AccordionItem>
        </LazyAccordion>
      ))}
    </>
  )
}

export default GridView
