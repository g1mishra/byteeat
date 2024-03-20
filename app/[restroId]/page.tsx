import { fetchRestaurant } from "@/services/restaurantService"

const MenuByCategory = ({ menus }) => {
    // Grouping menu items by category
    const groupedMenus = menus.reduce((acc, menu) => {
      if (!acc[menu.category]) {
        acc[menu.category] = [];
      }
      acc[menu.category].push(menu);
      return acc;
    }, {});
  
    return (
      <div>
        {Object.keys(groupedMenus).map(category => (
          <div key={category}>
            <h1><strong>{category}</strong></h1>
            <ul>
              {groupedMenus[category].map(item => (
                <li key={item.id}>
                  {item.dish} - {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }


const Welcome = async ({ params }: any) => {
    console.log(params)
    const restro_id = Number(params.restroId)
    const menu = await fetchRestaurant(restro_id)
    const items = menu.menus
    console.log(items)
    return (
        <>
         <MenuByCategory menus={items}></MenuByCategory>
        </>
    )
}

export default Welcome