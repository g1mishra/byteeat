"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getTodayOrdersAllRestaurants } from "@/services/order.services"
import { Order, OrderStatus } from "@prisma/client"
import { EventSource } from "extended-eventsource"

import { useToast } from "@/components/ui/use-toast"
import { DataTable, dcolumns } from "@/components/orders_table"

// Sound to play when a new order is received
const sound = typeof window !== "undefined" ? new Audio("/new-order.wav") : null

export default function Orders() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckedTSRef = useRef<string | null>(null)

  const connectToEventSource = useCallback(() => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const newEventSource = new EventSource(`/api/orders-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastCheckedTS: lastCheckedTSRef.current || null,
        date: new Date().toISOString(),
      }),
      withCredentials: true
    })

    newEventSource.onmessage = (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)

      if (data.type === "ping") {
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
            lastCheckedTSRef.current = newOrder.createdAt
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
  }, [toast])

  useEffect(() => {
    // Fetch initial orders
    const fetchInitialOrders = async () => {
      setIsLoading(true)
      try {
        const date = new Date().toISOString()
        const initialOrders = await getTodayOrdersAllRestaurants(date)
        setOrders(initialOrders as unknown as Order[])
      } catch (error) {
        console.error("Error fetching initial orders:", error)
        toast({
          title: "Failed to fetch initial orders",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        connectToEventSource()
      }
    }

    fetchInitialOrders()

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectToEventSource, toast])

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
