import { Order } from "@prisma/client"
import { EventSource } from "extended-eventsource"
import { useCallback, useEffect, useRef } from "react"

const useConnectToEventSource = (
  url: string,
  restaurantId: string | null,
  newOrderCallback: (order: Order) => void
) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckedTSRef = useRef<string | null>(null)

  const connect = useCallback(() => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      const newEventSource = new EventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastCheckedTS: lastCheckedTSRef.current || null,
          date: new Date().toISOString(),
          restaurantId: restaurantId,
        }),
        withCredentials: true,
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
          lastCheckedTSRef.current = newOrder.createdAt
          newOrderCallback(newOrder)
        }
      }

      newEventSource.onerror = (error) => {
        newEventSource.close()
        eventSourceRef.current = null

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 100)
      }

      eventSourceRef.current = newEventSource
    } catch (error) {
      console.error("Error connecting to event source:", error)
      setTimeout(() => {
        connect()
      }, 1000)
    }
  }, [url, restaurantId, newOrderCallback])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
      console.log("Disconnected from event source")
    }
  }, [disconnect])

  return { connect, disconnect }
}

export default useConnectToEventSource
