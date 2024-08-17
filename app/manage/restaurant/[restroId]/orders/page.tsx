"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getTodayOrdersByRestaurant } from "@/services/order.services"
import { Order, OrderStatus } from "@prisma/client"

import { useToast } from "@/components/ui/use-toast"
import { DataTable, dcolumns } from "@/components/orders_table"

// Sound to play when a new order is received
const sound = typeof window !== "undefined" ? new Audio("/new-order.wav") : null

export default function Orders({ params }: { params: { restroId: string } }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connectToEventSource = useCallback(() => {
    if (!params.restroId) return

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const newEventSource = new EventSource(
      `/api/orders-stream?restaurantId=${params.restroId}`
    )

    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "ping") {
        // Ping event to keep the connection alive
        return
      }

      if (data.type === "error") {
        console.error("Error from server:", data.message)
        return
      }

      if (data.type === "newOrder") {
        const newOrder = data.order
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
            return [newOrder, ...prevOrders]
          }
          return prevOrders
        })
      }
    }

    newEventSource.onerror = (error) => {
      console.error("EventSource failed:", error)
      newEventSource.close()
      eventSourceRef.current = null

      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(connectToEventSource, 1)
    }

    eventSourceRef.current = newEventSource
  }, [params.restroId, toast])

  useEffect(() => {
    if (!params.restroId) return

    // Fetch initial orders
    const fetchInitialOrders = async () => {
      setIsLoading(true)
      try {
        const date = new Date().toISOString()
        const initialOrders = await getTodayOrdersByRestaurant(
          params.restroId,
          date
        )
        setOrders(initialOrders)
      } catch (error) {
        console.error("Error fetching initial orders:", error)
        toast({
          title: "Failed to fetch initial orders",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialOrders().then(() => {
      // Set up SSE connection
      connectToEventSource()
    })

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [params.restroId, connectToEventSource, toast])

  const playSound = () => {
    if (!sound) return
    sound.play().catch((error) => console.error("Failed to play sound:", error))
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status }
        }
        return order
      })
    )
  }

  return (
    <DataTable
      columns={dcolumns}
      data={orders}
      updateOrderStatus={updateOrderStatus}
      isLoading={isLoading}
    />
  )
}
