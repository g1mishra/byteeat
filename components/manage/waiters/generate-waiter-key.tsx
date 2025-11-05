"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateWaiterKey } from "@/lib/utils"
import { createJoiningKey, updateJoiningKey } from "@/services/waiter.service"
import { Prisma } from "@prisma/client"
import React, { useEffect, useState } from "react"

type RestaurantWithJoiningKey = Prisma.RestaurantGetPayload<{
  include: { joiningKey: true }
}>

export default function GenerateWaiterKey({
  restaurant,
}: {
  restaurant: RestaurantWithJoiningKey
}) {
  const [isExpired, setIsExpired] = useState(false)

  const updateWaiterKey = async () => {
    const key = generateWaiterKey()
    await updateJoiningKey(key, restaurant.id)
    setIsExpired(false)
  }

  useEffect(() => {
    const createWaiterKey = async () => {
      const key = generateWaiterKey()
      await createJoiningKey(key, restaurant.id)
    }

    if (!restaurant.joiningKey) {
      createWaiterKey()
    } else if (restaurant?.joiningKey?.expiresAt) {
      const now = new Date()
      setIsExpired(now > new Date(restaurant.joiningKey.expiresAt))
    }
  }, [restaurant.id, restaurant.joiningKey])

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Generate New Key</h2>
      <div className="flex items-center">
        <Input value={restaurant.joiningKey?.field || ""} readOnly className="mr-4 flex-1" />
        <Button onClick={updateWaiterKey}>Generate New Key</Button>
      </div>

      <p className="my-4">
        {isExpired
          ? "The joining key has expired. Please generate a new one to share with your waiters."
          : "Share the joining key with your waiter. It will expire in 15 minutes."}
      </p>
    </div>
  )
}
