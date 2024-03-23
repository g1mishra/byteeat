"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { OrganizedMenu } from "@/app/[restroId]/page"

interface CatAndItemsProps {
  menu: OrganizedMenu
}

const CatAndItems = ({ menu }: CatAndItemsProps) => {
  return (
    <div className="gap-y-120 content-center">
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(menu).map((category) => (
          <AccordionItem value={category}>
            <AccordionTrigger className="text-lg font-bold capitalize">
              {category}
            </AccordionTrigger>
            {menu[category].map((item) => (
              <AccordionContent>
                <h2>{item.dish}</h2>
                <p>{item.price}</p>
                <p>{item.description}</p>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default CatAndItems
