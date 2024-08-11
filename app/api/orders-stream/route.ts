import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "../auth/authOption"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get("restaurantId")

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Set headers for SSE
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false

      // Function to send events to the client
      const sendEvent = (data: any) => {
        if (!isClosed) {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        }
      }

      // Send initial ping to establish connection
      sendEvent({ type: "ping" })

      // Keep track of the last checked timestamp
      let lastChecked = new Date()

      let fetchBy = {}
      if (restaurantId && String(restaurantId).length > 10) {
        fetchBy = { restaurantId: parseInt(restaurantId) }
      } else {
        fetchBy = { userId: session.user.id }
      }

      // Function to check for new orders
      const checkNewOrders = async () => {
        try {
          const newOrders = await prisma.order.findMany({
            where: {
              ...fetchBy,
              createdAt: { gt: lastChecked },
              status: { not: "CANCELLED" },
            },
            orderBy: { createdAt: "asc" },
          })

          if (newOrders.length > 0) {
            newOrders.forEach((order) => {
              sendEvent({ type: "newOrder", order })
            })
            lastChecked = newOrders[newOrders.length - 1].createdAt
          }
        } catch (error) {
          console.error("Error checking for new orders:", error)
          sendEvent({ type: "error", message: "Error checking for new orders" })
        }
      }

      // Check for new orders immediately
      await checkNewOrders()

      // Set up interval to check for new orders
      const intervalId = setInterval(checkNewOrders, 5000) // Check every 5 seconds

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId)
        isClosed = true
        controller.close()
      })
    },
    cancel() {
      console.log("Stream canceled")
    },
  })

  return new NextResponse(stream, { headers })
}
