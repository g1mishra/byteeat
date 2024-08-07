import {
  fetchRestaurant,
  getRestaurantIdBySlug,
  getRestaurantSlug,
} from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"
import NotFound from "@/app/not-found"

import QRMenu from "./QRView"

async function QRViewPage({
  params,
}: {
  params: {
    restroId: string
  }
}) {
  const { restroId } = params
  const session = await getServerSession(authOptions)
  if (!session || !session?.user) return <UnAuthorized />
  const response = await fetchRestaurant(restroId, session?.user?.id)
  if (!response) return <UnAuthorized />

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <QRMenu slug={response.slug} totalTables={response.tableSize} />
    </div>
  )
}

export default QRViewPage
