import { fetchRestaurant } from "@/services/restaurantService"

import EditPage from "./EditPage"

const EditRestaurant = async ({ params }: any) => {
  const { restroId } = params
  const response = await fetchRestaurant(restroId)
  if (!response) return null
  return <EditPage response={response} />
}

export default EditRestaurant
