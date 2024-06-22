import { fetchRestaurant } from "@/services/restaurantService"

import EditPage from "./EditPage"

const EditRestaurant = async ({ params }: any) => {
  const { restroId } = params
  const response = await fetchRestaurant(restroId)

  return (
    <>
      <p>
        Need to add all sort of editing, like changing name, logo, address, etc.
      </p>

      {response && <EditPage response={response} />}
    </>
  )
}

export default EditRestaurant
