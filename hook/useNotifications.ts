import { Order } from "@prisma/client"
import { useCallback, useEffect } from "react"

export function useNotifications() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        try {
          let permission = Notification.permission
          if (permission !== "granted") {
            permission = await Notification.requestPermission()
            if (permission !== "granted") {
              console.error("Notification permission denied.")
            }
          }
        } catch (error) {
          console.error("Failed to request notification permission:", error)
        }
      } else {
        console.warn("Notifications are not supported by this browser.")
      }
    }

    requestNotificationPermission()
  }, [])

  const showNotification = useCallback(async (order: Order) => {
    const message = `🚀 You have a new order from table ${order.tableNo}, amount: ${order.total}`

    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready
      registration.showNotification(message, {
        data: JSON.stringify({
          title: "New Order Received",
          message: message,
          url: `/manage/restaurants/${order.restaurantId}/orders`,
          // icon: "/icon.png", // Optional icon
          // badge: "/badge.png", // Optional badge
        }),
      })
    }
  }, [])

  // Add new order to the ref
  const pushOrder = (order: Order) => {
    showNotification(order)
  }

  return { pushOrder }
}
