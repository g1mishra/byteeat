import Link from "next/link"
import { fetchRestaurant } from "@/services/restaurantService"
import { fetchCategory } from "@/services/menuService"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WithCreateMenuDialog } from "@/components/manage/create-menu"

const ReturnCategory = async (categoryId: any) => {

  console.log(await fetchCategory(1))
  console.log()
  const categ = await fetchCategory(categoryId.categoryId);

  return (<>
   {categ?.categoryName}
  </>)


}

const RestaurantDetails = async ({ params }: any) => {
  const { restroId } = params

  const response = await fetchRestaurant(parseInt(restroId))
  if (!response) throw new Error("Network response was not ok.")

  return (
    <div className="flex flex-col gap-y-6 text-white">
      <div>
        <h1 className="text-4xl font-bold">{response.name}</h1>
        <p>{response.address}</p>
        <p>Table size: {response.tableSize}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {response?.menus?.map((menu) => (
          <WithCreateMenuDialog
            key={menu.id}
            restaurantId={parseInt(restroId)}
            itemData={menu}
          >
            <Card>
              <CardHeader>
                <CardTitle>{menu.dish}</CardTitle>
                <CardDescription>
                  <ReturnCategory categoryId={menu.categoryId}></ReturnCategory>
                </CardDescription>
              </CardHeader>
            </Card>
          </WithCreateMenuDialog>
        ))}
      </div>
      <WithCreateMenuDialog restaurantId={parseInt(restroId)}>
        <Card className="flex items-center justify-center hover:cursor-pointer">
          <PlusIcon size={24} />
        </Card>
      </WithCreateMenuDialog>

      <Link href={`/${response.id}`}>
        <Button>view menu</Button>
      </Link>
    </div>
  )
}

export default RestaurantDetails
