import { redirect } from "next/navigation"
import { fetchRestaurant } from "@/services/restaurantService"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"

import EditPage from "./EditPage"

const EditRestaurant = async ({ params }: any) => {
  const { restroId } = params
  const session = await getServerSession(authOptions)
  if (!session || !session?.user) return <UnAuthorized />

  if (session.user.role !== Role.OWNER) {
    redirect("/manage")
  }

  const response = await fetchRestaurant(restroId, session?.user?.id, {
    includeSocialLinks: true,
  })
  if (!response) return <UnAuthorized />
  return <EditPage response={response} />
}

export default EditRestaurant
