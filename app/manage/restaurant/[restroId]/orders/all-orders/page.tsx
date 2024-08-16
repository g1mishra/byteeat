"use client"

import { useEffect, useState } from "react"
import { getAllOrdersByRestaurant } from "@/services/order.services"
import { Order } from "@prisma/client"

import { DataTable, dcolumns } from "@/components/orders_table"

export default function Orders({ params }: { params: { restroId: string } }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const fetchedOrders = await getAllOrdersByRestaurant(params.restroId)
        setOrders(fetchedOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [params.restroId])

  return <DataTable columns={dcolumns} data={orders} isLoading={isLoading} />
}
