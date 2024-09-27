import { fetchRestaurant } from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"

import QuickOrder from "./QuickOrder"

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

  return <QuickOrder restaurant={response as any} />
}
