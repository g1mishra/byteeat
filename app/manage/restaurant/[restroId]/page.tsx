import Link from "next/link"
import { fetchCategoryById } from "@/services/menuService"
import { fetchRestaurant } from "@/services/restaurantService"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WithCreateMenuDialog } from "@/components/manage/create-menu"

import MenuList from "./MenuList"

const RestaurantDetails = async ({ params }: any) => {
  const { restroId } = params

  const response = await fetchRestaurant(restroId, {
    includeMenuItems: true,
    includePrice: true,
  })

  console.log("Restaurant response")
  console.log(JSON.stringify(response, null, 2))

  if (!response) throw new Error("Network response was not ok.")

  return (
    <div className="flex flex-col gap-y-6 dark:text-white">
      <div>
        <h1 className="text-4xl font-bold">{response.name}</h1>
        <p>{response.address_string}</p>
        <p>Table size: {response.tableSize}</p>
      </div>

      <div>
        {response?.ItemCategory?.map((menu) => (
          <MenuList key={menu.id} menu={menu} restroId={restroId} />
        ))}
      </div>
      <WithCreateMenuDialog restaurantId={restroId}>
        <Card className="flex items-center justify-center hover:cursor-pointer">
          <PlusIcon size={24} />
        </Card>
      </WithCreateMenuDialog>

      <Link href={`/${response.slug}`}>
        <Button>view menu</Button>
      </Link>
      <Link href={`/${response.slug}/menuqr`}>
        <Button>view QR</Button>
      <Link href={`/${response.slug}/addlogo`}>
        <Button>Add logo</Button>
      </Link>
      </Link>
    </div>
  )
}

export default RestaurantDetails
