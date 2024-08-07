import dynamic from "next/dynamic"
import { Role, User } from "@prisma/client"

import { Button } from "../ui/button"

const WithCreateRestaurantDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-create-restaurant"),
  { ssr: false }
)

const WithJoinRestaurantDialog = dynamic(
  () => import("@/components/manage/dialog-trigger/with-join-restaurant"),
  { ssr: false }
)

const NoRestaurant = ({
  className = "",
  user,
}: {
  className?: string
  user: User
}) => {
  return (
    <>
      <div
        className={`flex h-80 shrink-0 flex-col items-center justify-center self-stretch rounded-lg p-4 shadow ${className}`}
      >
        <div className="flex flex-col items-center gap-4 py-5">
          <div className="flex flex-col items-center">
            <p className="font-inter text-center text-2xl font-semibold leading-tight lg:text-3xl dark:text-white">
              You don&apos;t have any restaurant yet
            </p>
          </div>
          <span className="font-inter text-center text-base font-normal text-gray-400 lg:text-lg">
            {user.role === Role.OWNER ? "Create" : "Join"} a restaurant to get
            started
          </span>
        </div>

        {user.role === Role.OWNER ? (
          <WithCreateRestaurantDialog>
            <Button>Create Restaurant</Button>
          </WithCreateRestaurantDialog>
        ) : (
          <WithJoinRestaurantDialog>
            <Button>Join Restaurant</Button>
          </WithJoinRestaurantDialog>
        )}
      </div>
    </>
  )
}

export default NoRestaurant
