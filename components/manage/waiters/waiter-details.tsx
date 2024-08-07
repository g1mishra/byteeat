"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { removeWaiter } from "@/services/waiter.service"
import { Role, User } from "@prisma/client"
import { TrashIcon } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

export default function WaiterDetails({ waiters }: { waiters: User[] }) {
  const session = useSession()
  const params = useParams<{ restroId: string }>()

  return (
    <div className="mt-10 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Current Waiters</h2>
      <div className="flex flex-wrap gap-6">
        {waiters.map((waiter) => (
          <div
            key={waiter.id}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-6 py-4"
          >
            <div className="mr-4 size-16 overflow-hidden rounded-full">
              <Image
                src={waiter.image || "/placeholder.svg"}
                alt={waiter.name || ""}
                width={64}
                height={64}
                className="object-cover"
                style={{ aspectRatio: "64/64", objectFit: "cover" }}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium">{waiter.name}</h3>
            </div>
            {session?.data?.user?.role === Role.OWNER && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeWaiter(waiter.id, params.restroId)}
                className="ml-auto"
              >
                <TrashIcon className="text-red-400" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
