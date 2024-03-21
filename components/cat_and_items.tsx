"use client"

import React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const CatAndItems = ({ menu }: any) => {
  console.log(menu)
  return (
    <div>
      {Object.keys(menu).map((category) => (
        <Collapsible key={category}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="lg">
              {category}
              <CaretSortIcon className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
            {menu[category].map(
              (item) => <li key={item.dish}>{item.dish} - {item.price}</li>
            )}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ))}
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
