"use client"

import { useEffect, useState } from "react"
import { getTodayOrdersAllRestaurants } from "@/services/order.services"
import { Order } from "@prisma/client"

import { useToast } from "@/components/ui/use-toast"
import { DataTable, dcolumns } from "@/components/orders_table"

// Sound to play when a new order is received
const sound = typeof window !== "undefined" ? new Audio("/new-order.wav") : null

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Fetch initial orders
    const fetchInitialOrders = async () => {
      const date = new Date()
      const initialOrders = await getTodayOrdersAllRestaurants(date)
      setOrders(initialOrders)
    }

    fetchInitialOrders()

    // Set up SSE connection
    const eventSource = new EventSource("/api/orders-stream")

    eventSource.onmessage = (event) => {
      if (event.data.includes("ping")) {
        // Ping event to keep the connection alive
        return
      }

      if (event.data.includes("error")) {
        const error = JSON.parse(event.data)
        console.error("Error from server:", error)
        return
      }

      if (event.data.includes("newOrder")) {
        const data = JSON.parse(event.data)
        const newOrder = data.order as Order
        setOrders((prevOrders) => {
          // Check if the order already exists
          const orderExists = prevOrders.some(
            (order) => order.id === newOrder.id
          )
          if (!orderExists) {
            toast({
              title: "New Order Received",
            })
            playSound() // Play sound when a new order is received
            return [newOrder as unknown as Order, ...prevOrders]
          }
          return prevOrders
        })
      }
    }

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [toast])

  const playSound = () => {
    if (!sound) return
    sound.play().catch((error) => console.error("Failed to play sound:", error))
  }

  return (
    <>
      <DataTable columns={dcolumns} data={orders} />
    </>
  )
}
