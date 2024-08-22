"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useConnectToEventSource from "@/hook/useConnectToEventSource"
import { useNotifications } from "@/hook/useNotifications"
import { getTodayOrdersByRestaurant } from "@/services/order.services"
import { Order, OrderStatus } from "@prisma/client"

import { debounce } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { DataTable, dcolumns } from "@/components/orders_table"

// Sound to play when a new order is received
const sound = typeof window !== "undefined" ? new Audio("/new-order.wav") : null
const ENDPOINT = "/api/orders-stream"

export default function Orders({ params }: { params: { restroId: string } }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [failedToFetch, setFailedToFetch] = useState(false)
  const initialOrdersFetched = useRef(false)
  const { toast } = useToast()
  const { pushOrder } = useNotifications()

  const { connect, disconnect } = useConnectToEventSource(
    ENDPOINT,
    params.restroId,
    handleNewOrder
  )

  const fetchInitialOrders = useCallback(async () => {
    setIsLoading(true)
    setFailedToFetch(false)
    initialOrdersFetched.current = false
    try {
      const date = new Date().toISOString()
      const initialOrders = await getTodayOrdersByRestaurant(
        params.restroId,
        date
      )
      if (initialOrders) {
        setOrders(initialOrders as unknown as Order[])
      }
      initialOrdersFetched.current = true
      connect()
    } catch (error) {
      console.error("Error fetching initial orders:", error)
      setFailedToFetch(true)
      toast({
        title: "Failed to fetch initial orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.restroId, connect, toast])

  function handleNewOrder(newOrder: Order) {
    setOrders((prevOrders) => {
      const orderExists = prevOrders.some((order) => order.id === newOrder.id)
      if (!orderExists) {
        debounce(() => {
          if (sound) {
            sound
              .play()
              .catch((error) => console.error("Failed to play sound:", error))
          }
          toast({
            title: "New Order Received",
          })
        }, 500)()
        pushOrder(newOrder)
        return [newOrder, ...prevOrders]
      }
      return prevOrders
    })
  }

  useEffect(() => {
    if (!params.restroId) return
    if (initialOrdersFetched.current) return
    fetchInitialOrders()
    return () => {
      disconnect()
    }
  }, [params.restroId, disconnect, fetchInitialOrders])

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
      reFetchInitialOrders={failedToFetch ? fetchInitialOrders : undefined}
    />
  )
}
