import { fetchRestaurant } from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"

import EditPage from "./EditPage"

const EditRestaurant = async ({ params }: any) => {
  const { restroId } = params
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return <UnAuthorized />
  const response = await fetchRestaurant(restroId, session?.user?.userId)
  if (!response) return <UnAuthorized />
  return <EditPage response={response} />
}

export default EditRestaurant
