import dynamic from "next/dynamic"
import Link from "next/link"
import { FullAdress, fetchRestaurant } from "@/services/restaurantService"
import { PlusIcon } from "lucide-react"
import { getServerSession } from "next-auth"

import { formatAddress } from "@/lib/string"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import UnAuthorized from "@/components/UnAuthorized"
import LogoOrAvatar from "@/components/logo-or-avatar"
import { authOptions } from "@/app/api/auth/authOption"

import MenuCardList from "../MenuCardList"

const WithCreateMenuDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-create-item"),
  { ssr: false }
)

const RestaurantDetails = async ({ params }: any) => {
  const { restroId } = params

  const session = await getServerSession(authOptions)
  if (!session || !session.user) return <UnAuthorized />
  let response = await fetchRestaurant(restroId, session?.user?.userId, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!response) return <UnAuthorized />

  return (
    <div className="flex w-full flex-col gap-y-6 dark:text-white">
      <div className="flex justify-between gap-4 max-sm:flex-col">
        <div className="flex flex-col items-start gap-y-0.5">
          <LogoOrAvatar
            name={response?.name}
            src={response?.logoUrl || ""}
            className="object-left max-sm:w-auto max-sm:min-w-32 max-sm:object-contain"
          />
          <h1 className="mt-2 text-4xl font-bold">{response.name}</h1>
          <p>{formatAddress(response as FullAdress)}</p>
          <p>Table size: {response.tableSize}</p>
        </div>
        <div className="flex flex-wrap justify-between gap-4 self-start sm:gap-x-6">
          <Link href={`/${response.slug}`} target="_blank">
            <Button>Menu Preview</Button>
          </Link>
        </div>
      </div>
      <div>
        {response?.ItemCategory?.map((menu) => (
          <MenuCardList key={menu.id} menu={menu} slug={response.slug} />
        ))}
      </div>
      <WithCreateMenuDialog restaurantId={restroId} slug={response.slug}>
        <Card className="mx-auto flex w-full max-w-24 items-center justify-center p-6 hover:cursor-pointer">
          <PlusIcon size={24} />
        </Card>
      </WithCreateMenuDialog>
    </div>
  )
}

export default RestaurantDetails
