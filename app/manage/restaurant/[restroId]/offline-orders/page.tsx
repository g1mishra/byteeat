import { fetchRestaurant } from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"

import Orders from "./Orders"

export default async function OfflineOrdersPage({
  params,
}: {
  params: { restroId: string }
}) {
  const { restroId } = params

  const session = await getServerSession(authOptions)
  if (!session || !session.user) return <UnAuthorized />

  let response = await fetchRestaurant(restroId, session.user.id, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!response) return <UnAuthorized />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <Orders restaurant={response} />
    </div>
  )
}
