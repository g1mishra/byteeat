import { MenuItemI } from "@/services/menuService"
import { fetchRestaurant } from "@/services/restaurantService"

import CatAndItems from "@/components/cat_and_items"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

function reorganizeMenu(menuItems: MenuItemI[]): OrganizedMenu {
  const organizedMenu: OrganizedMenu = {}

  menuItems.forEach((item) => {
    const { category } = item

    if (!organizedMenu[category]) {
      organizedMenu[category] = []
    }

    organizedMenu[category].push(item)
  })

  return organizedMenu
}

const Welcome = async ({ params }: any) => {
  const restaurant = await fetchRestaurant(Number(params.restroId))
  const parsedMenu = reorganizeMenu(restaurant?.menus!)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
      <p>{restaurant?.address}</p>
      <CatAndItems menu={parsedMenu} />
    </div>
  )
}

export default Welcome
