import { NextRequest, NextResponse } from "next/server"
import { checkUserRestaurantPermission } from "@/services/restaurantService"
import { Order } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"

import { authOptions } from "../auth/authOption"

type EventData =
  | { type: "ping" }
  | { type: "newOrder"; order: Order }
  | { type: "error"; message: string }

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// This is required to enable streaming
export const dynamic = "force-dynamic"

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return retryOperation(operation, retries - 1)
    }
    throw error
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get("restaurantId")

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  })

  let lastChecked: any = null

  const stream = new ReadableStream({
    async start(controller) {
      let isStreamActive = true

      const sendEvent = (data: EventData) => {
        if (isStreamActive) {
          try {
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
          } catch (error) {
            console.error("Error sending event:", error)
            isStreamActive = false
          }
        }
      }

      sendEvent({ type: "ping" })

      let fetchBy: any = {
        userId: session.user.id,
      }
      if (restaurantId) {
        const hasPermission = await checkUserRestaurantPermission(
          session.user.id,
          restaurantId
        )
        if (!hasPermission) {
          sendEvent({
            type: "error",
            message: "Unauthorized access to restaurant orders",
          })
          isStreamActive = false
          controller.close()
          return
        }
        fetchBy = { restaurantId }
      }

      const checkNewOrders = async () => {
        if (!isStreamActive) return

        if (lastChecked) {
          fetchBy = {
            ...fetchBy,
            createdAt: { gt: lastChecked },
            status: { not: "CANCELLED" },
          }
        }

        try {
          const newOrders = await retryOperation(() =>
            prisma.order.findMany({
              where: {
                ...fetchBy,
                status: { not: "CANCELLED" },
              },
              orderBy: { createdAt: "asc" },
              take: 100,
            })
          )

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

      await checkNewOrders()

      const intervalId = setInterval(checkNewOrders, 5000) // Check every 5 seconds

      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId)
        isStreamActive = false
        controller.close()
      })
    },
    cancel() {
      console.log("Stream canceled")
    },
  })

  return new NextResponse(stream, { headers })
}
