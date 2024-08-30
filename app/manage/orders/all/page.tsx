"use client"

import { useEffect, useState } from "react"
import { getAllOrdersAllRestaurants } from "@/services/order.services"
import { Order } from "@prisma/client"

import { OrdersTableRenderer, dcolumns } from "@/components/OrdersTableRenderer"

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const fetchedOrders = await getAllOrdersAllRestaurants()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <OrdersTableRenderer
      columns={dcolumns}
      data={orders}
      isLoading={isLoading}
    />
  )
}
