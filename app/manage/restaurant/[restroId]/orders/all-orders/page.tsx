"use client"

import { useEffect, useState } from "react"
import { getAllOrdersByRestaurant } from "@/services/order.services"
import { Order, OrderStatus } from "@prisma/client"

import { OrdersTableRenderer, dcolumns } from "@/components/OrdersTableRenderer"

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

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      setOrders((prevOrders) => {
        const index = prevOrders.findIndex((order) => order.id === id)
        if (index !== -1) {
          const updatedOrders = [...prevOrders]
          updatedOrders[index].status = status
          return updatedOrders
        }
        return prevOrders
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  return (
    <OrdersTableRenderer
      columns={dcolumns}
      data={orders}
      isLoading={isLoading}
      updateOrderStatus={updateOrderStatus}
    />
  )
}
