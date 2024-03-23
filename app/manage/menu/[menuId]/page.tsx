import { fetchMenu } from "@/services/menuService"

const RestaurantDetails = async ({ params }: any) => {
  const { menuId } = params

  const response = await fetchMenu(menuId)
  if (!response) throw new Error("Network response was not ok.")
  console.log(response)
  return (
    <div className="text-black dark:text-white">
      <h1 className="text-4xl font-bold">{response.dish}</h1>
      <p>{response.description}</p>
      <p>{response.category}</p>
      <p>{response.price}</p>
    </div>
  )
}

export default RestaurantDetails
