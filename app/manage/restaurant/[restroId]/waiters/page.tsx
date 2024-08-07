import { fetchRestaurant } from "@/services/restaurantService"
import { getWaiters } from "@/services/waiter.service"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import GenerateWaiterKey from "@/components/manage/waiters/generate-waiter-key"
import WaiterDetails from "@/components/manage/waiters/waiter-details"
import { authOptions } from "@/app/api/auth/authOption"

export default async function Waiters({
  params: { restroId },
}: {
  params: { restroId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const waiters = await getWaiters(restroId)
  const restaurant = await fetchRestaurant(restroId, session.user.id, {
    includeJoiningKey: true,
  })

  if (!waiters || !restaurant) return

  return (
    <div className="mx-auto mt-8 max-w-6xl md:py-8">
      <h1 className="mb-8 text-3xl font-bold">Waiters</h1>
      {session?.user.role === Role.OWNER && (
        <GenerateWaiterKey restaurant={restaurant} />
      )}
      <WaiterDetails waiters={waiters} />
    </div>
  )
}
