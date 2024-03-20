import { fetchRestaurant } from "@/services/restaurantService"



const Welcome = async ({ params }: any) => {
    console.log(params)
    const restro_id = Number(params.restroId)
    const menu = await fetchRestaurant(restro_id)
    const items = menu.menus
    console.log(items)
    return (
        <>
         <ul>
            {items.map(item => (
                <li>
                    {item.dish}
                    {item.price}
                </li>
            ))}
         </ul>
        </>
    )
}

export default Welcome