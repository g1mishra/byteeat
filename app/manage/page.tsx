import dynamic from "next/dynamic"
import Link from "next/link"
import { redirect } from "next/navigation"
import { fetchRestaurants } from "@/services/restaurantService"
import { Role } from "@prisma/client"
import { PlusIcon } from "lucide-react"
import { getServerSession } from "next-auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AuthUserMenu from "@/components/AuthUserMenu"
import NoRestaurant from "@/components/manage/no-restaurant"

import { authOptions } from "../api/auth/authOption"

const WithCreateRestaurantDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-create-restaurant"),
  { ssr: false }
)

const WithJoinRestaurantDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-join-restaurant"),
  { ssr: false }
)

const Dashboard = () => {
  return (
    <main className="flex flex-col gap-y-6">
      <Restaurant />
    </main>
  )
}

const Restaurant = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/api/auth/signin?callbackUrl=/manage")

  const restroResponse = await fetchRestaurants(session.user.id)

  return (
    <div className="flex flex-1 flex-col space-y-6 p-4 pb-6">
      <div className="flex justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl  font-bold tracking-tight sm:text-2xl">
            Welcome to ByteEat Restaurant Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your restaurants - menu, tables, and more
          </p>
        </div>
        <AuthUserMenu user={session?.user} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-y-6">
        <h1 className="text-4xl font-bold dark:text-white">Restaurants</h1>
        {restroResponse?.length === 0 ? (
          <NoRestaurant user={session.user} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {restroResponse?.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/manage/restaurant/${restaurant.id}`}
                className="block h-full"
              >
                <Card
                  key={restaurant.id}
                  className="hover:bg-accent flex h-full flex-col justify-between transition-colors duration-200"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {restaurant.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {restaurant.address_string}
                    </CardDescription>
                  </CardHeader>
                  <div className="mt-auto p-4">
                    <Button variant="outline" className="w-full">
                      Manage
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
            {session.user.role === Role.OWNER ? (
              <WithCreateRestaurantDialog>
                <Card className="hover:border-primary flex h-full flex-col items-center justify-center border-2 border-dashed p-4 transition-colors duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Create New Restaurant
                    </CardTitle>
                  </CardHeader>
                  <div className="mt-auto">
                    <Button variant="outline" className="w-full">
                      <PlusIcon size={16} className="mr-2" />
                      Create
                    </Button>
                  </div>
                </Card>
              </WithCreateRestaurantDialog>
            ) : (
              <WithJoinRestaurantDialog>
                <Card className="hover:border-primary flex h-full flex-col items-center justify-center border-2 border-dashed p-4 transition-colors duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Join an existing restaurant
                    </CardTitle>
                  </CardHeader>
                  <div className="mt-auto">
                    <Button variant="outline" className="w-full">
                      <PlusIcon size={16} className="mr-2" />
                      Join
                    </Button>
                  </div>
                </Card>
              </WithJoinRestaurantDialog>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
