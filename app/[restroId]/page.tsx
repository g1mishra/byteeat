import { MenuItemI, ItemCategoryI, fetchPrice } from "@/services/menuService"
import { fetchRestaurant } from "@/services/restaurantService"

import CatAndItems from "@/components/cat_and_items"
import { any } from "zod"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

function reorganizeMenu(menuItems: any): OrganizedMenu {
  if (!menuItems) {
    return {}
  }

  const organizedMenu: OrganizedMenu = {}
  /*
  menuItems.forEach((item) => {
    const { category } = item

    if (!organizedMenu[category]) {
      organizedMenu[category] = []
    }

    organizedMenu[category].push(item)
  })
  */

  menuItems.forEach(categ => {
    const categName = categ.categoryName
    const items = categ.Item

    if(categName in organizedMenu){
      
      
      organizedMenu[categName].push(items)
    }
    else{
      // item["prices"] = fetchPrice(item.id)
      organizedMenu[categName] = items
    }
  });

  console.log("organised menu => ",organizedMenu)
  return organizedMenu
}

async function addPrices(parsedMenu: OrganizedMenu) {

  for (const categ in parsedMenu){
      for (const idx in parsedMenu[categ]){
          const itemObj: any = parsedMenu[categ][idx]
          itemObj["prices"] = await fetchPrice(Number(itemObj.id))
      }
  }
  return parsedMenu
}

const Welcome = async ({ params }: any) => {
  const restaurant = await fetchRestaurant(Number(params.restroId))
  console.log("here's the restro=>",restaurant)
  const parsedMenu = await addPrices(reorganizeMenu(restaurant?.ItemCategory!))
  console.log(parsedMenu)
  
  // console.log(await fetchPrice(3))
  

  return (
    <div className="container gap-y-2 py-4 sm:py-8">
      <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
      <p className="text-sm font-light">{restaurant?.address}</p>
      <CatAndItems menu={parsedMenu} />
    </div>
  )
}

export default Welcome
