import { fetchRestaurant } from "@/services/restaurantService"
import { getServerSession } from "next-auth"

import UnAuthorized from "@/components/UnAuthorized"
import { authOptions } from "@/app/api/auth/authOption"

import AddedDish from "./AddedDish"
import DishList from "./DishList"

export default async function OfflinePage({ params }: any) {
  const { restroId } = params

  const session = await getServerSession(authOptions)
  if (!session || !session?.user) return <UnAuthorized />

  let response = await fetchRestaurant(restroId, session?.user?.id, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!response) return <UnAuthorized />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Dishes</h2>
        {response?.ItemCategory?.map((menu) => (
          <DishList key={menu.id} menu={menu} slug={response.slug} />
        ))}
      </div>
      <AddedDish />
    </div>
  )
}
