import { authOptions } from "@/app/api/auth/authOption"
import UnAuthorized from "@/components/UnAuthorized"
import EditRestaurant from "@/components/manage/EditRestaurant"
import MenuPositions from "@/components/manage/MenuPositions"
import RestaurantAddons from "@/components/manage/RestaurantAddons"
import RestaurantMenu from "@/components/manage/RestaurantMenu/index"
import RestaurantTheme from "@/components/manage/RestaurantTheme"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchRestaurant } from "@/services/restaurantService"
import { EditIcon, LucideSortDesc, MenuIcon, Palette, PlusCircleIcon, PlusIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import dynamic from "next/dynamic"

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
        <h1 className="mb-2 text-2xl font-bold">Manage Restaurant: {response.name}</h1>
        <p className="mb-4 text-gray-600">
          Edit details, manage menu items, and configure settings for your restaurant.
        </p>
        <Tabs defaultValue="menu" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <TabsList className="inline-flex h-auto w-full space-x-2 rounded-lg bg-gray-200">
              <TabsTrigger
                value="menu"
                className="flex flex-1 items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <MenuIcon className="mr-2 size-5" /> Menu Items
              </TabsTrigger>
              <TabsTrigger
                value="addons"
                className="flex flex-1 items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <PlusCircleIcon className="mr-2 size-5" /> Addons
              </TabsTrigger>
              <TabsTrigger
                value="edit-restaurant"
                className="flex flex-1 items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <EditIcon className="mr-2 size-5" /> Edit Restaurant
              </TabsTrigger>
              <TabsTrigger
                value="menu-positions"
                className="flex flex-1 items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <LucideSortDesc className="mr-2 size-5" /> Menu Positions
              </TabsTrigger>
              <TabsTrigger
                value="theme"
                className="flex flex-1 items-center justify-center rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Palette className="mr-2 size-5" /> Theme
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="menu">
            <div
              className="h-[calc(100vh-11rem)] w-full max-w-full overflow-y-auto"
              data-radix-scroll-area-viewport="true"
            >
              <RestaurantMenu
                response={response}
                restaurantId={restroId}
                restaurantSlug={response.slug}
              />
            </div>
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
          <TabsContent value="theme" className="mt-6">
            <RestaurantTheme restaurant={response} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default RestaurantDetails
