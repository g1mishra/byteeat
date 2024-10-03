import dynamic from "next/dynamic"
import { fetchRestaurant } from "@/services/restaurantService"
import {
  EditIcon,
  LucideSortDesc,
  MenuIcon,
  PlusCircleIcon,
  PlusIcon,
  SortAsc,
} from "lucide-react"
import { getServerSession } from "next-auth"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UnAuthorized from "@/components/UnAuthorized"
import EditRestaurant from "@/components/manage/EditRestaurant"
import MenuPositions from "@/components/manage/MenuPositions"
import RestaurantAddons from "@/components/manage/RestaurantAddons"
import { authOptions } from "@/app/api/auth/authOption"

import MenuCardList from "../MenuCardList"

const WithCreateMenuDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-create-item"),
  { ssr: false }
)

const RestaurantDetails = async ({ params }: any) => {
  const { restroId } = params

  const session = await getServerSession(authOptions)
  if (!session || !session?.user) return <UnAuthorized />
  let response = await fetchRestaurant(restroId, session?.user?.id, {
    includeMenuItems: true,
    includePrice: true,
    includeSocialLinks: true,
  })

  if (!response) return <UnAuthorized />

  return (
    <div className="flex w-full flex-col gap-y-6 dark:text-white">
      <div className="w-full">
        <h1 className="mb-2 text-2xl font-bold">
          Manage Restaurant: {response.name}
        </h1>
        <p className="mb-4 text-gray-600">
          Edit details, manage menu items, and configure settings for your
          restaurant.
        </p>
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-4 gap-px rounded-lg bg-gray-200">
            <TabsTrigger
              value="menu"
              className="flex items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <MenuIcon className="mr-2 size-5" /> Menu Items
            </TabsTrigger>

            <TabsTrigger
              value="addons"
              className="flex items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <PlusCircleIcon className="mr-2 size-5" /> Addons
            </TabsTrigger>
            <TabsTrigger
              value="edit-restaurant"
              className="flex items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <EditIcon className="mr-2 size-5" /> Edit Restaurant
            </TabsTrigger>
            <TabsTrigger
              value="menu-positions"
              className="flex items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <LucideSortDesc className="mr-2 size-5" /> Menu Positions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="menu">
            {response?.ItemCategory?.map((menu) => (
              <MenuCardList key={menu.id} menu={menu} slug={response.slug} />
            ))}
            <WithCreateMenuDialog restaurantId={restroId} slug={response.slug}>
              <Card className="mt-4 flex h-full items-center justify-center p-6 hover:cursor-pointer">
                <PlusIcon size={24} />
                <span className="ml-2">Add New Item</span>
              </Card>
            </WithCreateMenuDialog>
          </TabsContent>
          <TabsContent value="addons">
            <RestaurantAddons restaurantId={restroId} />
          </TabsContent>
          <TabsContent value="edit-restaurant">
            <EditRestaurant response={response} />
          </TabsContent>
          <TabsContent value="menu-positions">
            <MenuPositions itemCategory={response?.ItemCategory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default RestaurantDetails
