import Link from "next/link"
import { fetchRestaurants } from "@/services/restaurantService"
import { PlusIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WithCreateRestaurantDialog } from "@/components/manage/create-restaurants"
import NoRestaurant from "@/components/manage/no-restaurant"

const Dashboard = () => {
  return (
    <main className="flex flex-col gap-y-6">
      <Restaurant />
    </main>
  )
}

const Restaurant = async () => {
  const restroResponse = await fetchRestaurants()
  if (!restroResponse) throw new Error("Network response was not ok.")

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-4xl font-bold text-white">Restaurants</h1>
      {restroResponse.length === 0 ? (
        <NoRestaurant />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {restroResponse.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/manage/restaurant/${restaurant.id}`}
            >
              <Card key={restaurant.id}>
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.address}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          <WithCreateRestaurantDialog>
            <Card className="flex items-center justify-center hover:cursor-pointer">
              <PlusIcon size={24} />
            </Card>
          </WithCreateRestaurantDialog>
        </div>
      )}
    </div>
  )
}

export default Dashboard
