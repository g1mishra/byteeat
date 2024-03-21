import { fetchRestaurant } from "@/services/restaurantService"
import CatAndItems from "@/components/cat_and_items";

interface MenuItem {
  id?: number;
  restaurantId: number;
  category: string;
  dish: string;
  price: number;
}

interface OrganizedMenu {
  [category: string]: { dish: string; price: number }[];
}

function reorganizeMenu(menuItems: MenuItem[]): OrganizedMenu {
  const organizedMenu: OrganizedMenu = {};

  menuItems.forEach(item => {
    const { category, dish, price } = item;

    if (!organizedMenu[category]) {
      organizedMenu[category] = [];
    }

    organizedMenu[category].push({ dish, price });
  });

  return organizedMenu;
}



const Welcome = async ({ params }: any) => {
  console.log(params)
  const restro_id = Number(params.restroId)
  const menu = await fetchRestaurant(restro_id)
  console.log(menu)
  const items = menu?.menus
  const parsedMenu = reorganizeMenu(items!)
  return (
    <>
      <CatAndItems menu={parsedMenu}></CatAndItems>
    </>
  )
}

export default Welcome