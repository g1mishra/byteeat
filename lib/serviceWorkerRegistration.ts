let isRegistered = false

export const registerServiceWorker = async () => {
  if (isRegistered) return

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js")
      isRegistered = true
      console.log("Service Worker registered")
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}
