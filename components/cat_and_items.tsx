"use client"

import React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const CatAndItems = ({ menu }: any) => {
  // console.log(menu)
  return (
    <div className="gap-y-120 content-center">
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(menu).map((category) => (
          
          <AccordionItem value={category}>
              <AccordionTrigger className="text-lg font-bold">{category}</AccordionTrigger>
            {menu[category].map((item) => (
              <AccordionContent>
                <h2>
                  {item.dish}
                </h2>
                <p></p>
                <p>{item.price}</p>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

{
  /* <Collapsible>
<CollapsibleTrigger asChild>
  <Button variant="ghost" size="sm">
    Can I use this in my project?
    <CaretSortIcon className="h-4 w-4" />
    <span className="sr-only">Toggle</span>
  </Button>
</CollapsibleTrigger>
<CollapsibleContent>
  Yes. Free to use for personal and commercial projects. No attribution
  required.
</CollapsibleContent>
</Collapsible> */
}
export default CatAndItems
