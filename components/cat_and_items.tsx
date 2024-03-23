"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { OrganizedMenu } from "@/app/[restroId]/page"
import Veg from "./icons/veg"
import NonVeg from "./icons/nonveg"
import { useState } from "react"
import { Button } from "./ui/button"



interface CatAndItemsProps {
  menu: OrganizedMenu
}

const CatAndItems = ({ menu }: CatAndItemsProps) => {
  const foodItems: any = {};
  const barItems: any = {};
  Object.keys(menu).forEach(key => {
    const items = menu[key];
    const food = items.filter(item => item.foodOrBar === "Food");
    if (food.length > 0) {
      foodItems[key] = food;
    }
  
    const bar = items.filter(item => item.foodOrBar === "Bar");
    if (bar.length > 0) {
      barItems[key] = bar;
    }
  });
  

  const [isFood,setMenuState] = useState(true)

  const [buttonText, setButtonText] = useState("Bar menu 🥂")

  function returnMenu() {

      if(isFood){
        setButtonText("Food menu 🍕")
        setMenuState(false)
      }
      else{
        setButtonText("Bar menu 🥂")
        setMenuState(true)
      }
  }

  const itemsToRender = isFood?foodItems:barItems
  console.log(itemsToRender)

  return (
    <div className="gap-y-120 content-center">
      <Button onClick={returnMenu} className="bg-silver">{buttonText}</Button>
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(itemsToRender).map((category) => (
          <AccordionItem value={category}>
            <AccordionTrigger className="text-lg font-bold capitalize">
              {category}
            </AccordionTrigger>
            {itemsToRender[category].map((item: any) => (
              <AccordionContent>
                {item.foodOrBar == "Food"?(item.vegOrNonVeg == 'Veg'?<Veg width="25" height="25"/>:<NonVeg width="25" height="25"/>):null}
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
