self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "New Notification"
  const url = data.url || "/manage/orders"

  const options = {
    body: data.message || "You have a new notification",
    icon: data.icon || "/icon.png",
    badge: data.badge || "/badge.png",
    data: {
      url: url,
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data.url || "/manage/orders"

  event.waitUntil(clients.openWindow(url))
})
