"use client"

import { useEffect } from "react"
import { createJoiningKey, updateJoiningKey } from "@/services/waiter.service"
import { Prisma } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type RestaurantWithJoiningKey = Prisma.RestaurantGetPayload<{
  include: { joiningKey: true }
}>

export default function GenerateWaiterKey({
  restaurant,
}: {
  restaurant: RestaurantWithJoiningKey
}) {
  const generateWaiterKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let key = ""
    for (let i = 0; i < 6; i++) {
      key += characters[Math.floor(Math.random() * characters.length)]
    }
    return key
  }

  const createWaiterKey = async () => {
    const key = generateWaiterKey()
    await createJoiningKey(key, restaurant.id)
  }

  const updateWaiterKey = async () => {
    const key = generateWaiterKey()
    await updateJoiningKey(key, restaurant.id)
  }

  useEffect(() => {
    if (!restaurant.joiningKey) {
      createWaiterKey()
    }
  }, [])

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Generate New Key</h2>
      <div className="flex items-center">
        <Input
          value={restaurant.joiningKey?.field || ""}
          readOnly
          className="mr-4 flex-1"
        />
        <Button onClick={updateWaiterKey}>Generate Again</Button>
      </div>
      <p className="my-4">
        Share the joining key with your waiter. It will expire in 15 minutes.
      </p>
    </div>
  )
}
