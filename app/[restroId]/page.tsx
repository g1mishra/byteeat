import { MenuItemI, fetchPrice } from "@/services/menuService"
import { fetchRestaurant } from "@/services/restaurantService"

import { Button } from "@/components/ui/button"
import MenuView from "@/components/cat_and_items"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

async function addPrices(parsedMenu: OrganizedMenu) {
  for (const categ in parsedMenu) {
    for (const idx in parsedMenu[categ]) {
      const itemObj: any = parsedMenu[categ][idx]
      itemObj["prices"] = await fetchPrice(itemObj.id)
    }
  }
  return parsedMenu
}

const Welcome = async ({ params }: any) => {
  const response = await fetchRestaurant(params.restroId, {
    includeMenuItems: true,
    includePrice: true,
  })
  console.log("here's the restro=>", JSON.stringify(response, null, 2))

  return (
    <div className="container gap-y-2 py-4 sm:py-8">
      <h1 className="text-2xl font-bold">{response?.name}</h1>
      <p className="text-sm font-light">{response?.address_string}</p>

      {response?.ItemCategory && <MenuView data={response?.ItemCategory} />}
    </div>
  )
}

export default Welcome
