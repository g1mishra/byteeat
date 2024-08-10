"use server"

import { Order, OrderItem, Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { Cart } from "@/lib/types"
import { authOptions } from "@/app/api/auth/authOption"

export type OrderWithItems = Order & { orderItems?: OrderItem[] }

// Create a new order
async function createOrder(
  restaurantId: string,
  tableNo: number,
  total = 0
): Promise<Order> {
  try {
    const resp = await prisma.userRestaurant.findFirst({
      where: {
        restaurantId: restaurantId,
        user: {
          role: Role.OWNER,
        },
      },
      select: {
        restaurantId: true,
        userId: true,
      },
    })

    if (!resp) {
      throw new Error("Restaurant not found")
    }

    const userId = resp.userId

    if (!userId) {
      throw new Error("User not found")
    }

    return await prisma.order.create({
      data: {
        restaurantId,
        status: "PENDING",
        total,
        tableNo,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
    })
  } catch (error) {
    throw new Error(`Failed to create order: ${(error as Error).message}`)
  }
}

async function updateOrder(payload: Partial<Order>): Promise<Order> {
  try {
    if (!payload.id) {
      throw new Error("Order ID is required")
    }
    return await prisma.order.update({
      where: { id: payload.id },
      data: { ...payload, updatedAt: new Date() },
    })
  } catch (error) {
    throw new Error(`Failed to update order: ${(error as Error).message}`)
  }
}

// Batch create order items
async function addOrderItems(orderId: string, items: Cart[]) {
  const data = items.map((item) => ({
    orderId,
    name: item.name,
    itemId: item.id,
    portion: item.portion || "",
    price: item.price,
    quantity: item.quantity,
  }))

  try {
    return await prisma.orderItem.createMany({
      data,
    })
  } catch (error) {
    throw new Error(`Failed to add order items: ${(error as Error).message}`)
  }
}

// Get all orders by restaurant
async function getAllOrdersByRestaurant(restaurantId: string) {
  try {
    return await prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    throw new Error(
      `Failed to get orders by restaurant: ${(error as Error).message}`
    )
  }
}

// Get all orders of all restaurants
async function getAllOrdersAllRestaurants() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User ID is required")
    }

    return await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    throw new Error(
      `Failed to get all orders of all restaurants: ${(error as Error).message}`
    )
  }
}

// Get order by ID
async function getOrderWithItemsById(orderId: string, includeItems = false) {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: includeItems },
    })
  } catch (error) {
    throw new Error(`Failed to get order by ID: ${(error as Error).message}`)
  }
}

async function getTodayOrdersByRestaurant(
  restaurantId: string,
  timestamp: Date
) {
  // add condition where cancelled orders are not included
  try {
    // Convert input timestamp to IST
    const istTimestamp = new Date(timestamp.getTime() + 5.5 * 60 * 60 * 1000)

    // Get IST year, month, and day
    const year = istTimestamp.getUTCFullYear()
    const month = istTimestamp.getUTCMonth()
    const day = istTimestamp.getUTCDate()

    // Create IST start and end of day, then convert back to UTC for database query
    const startOfDay = new Date(
      Date.UTC(year, month, day, 0, 0, 0, 0) - 5.5 * 60 * 60 * 1000
    )
    const endOfDay = new Date(
      Date.UTC(year, month, day, 23, 59, 59, 999) - 5.5 * 60 * 60 * 1000
    )

    return await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "CANCELLED",
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    throw new Error(
      `Failed to get today's orders by restaurant: ${(error as Error).message}`
    )
  }
}

async function getTodayOrdersAllRestaurants(timestamp: Date) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User ID is required")
    }

    // Convert input timestamp to IST
    const istTimestamp = new Date(timestamp.getTime() + 5.5 * 60 * 60 * 1000)

    // Get IST year, month, and day
    const year = istTimestamp.getUTCFullYear()
    const month = istTimestamp.getUTCMonth()
    const day = istTimestamp.getUTCDate()

    // Create IST start and end of day, then convert back to UTC for database query
    const startOfDay = new Date(
      Date.UTC(year, month, day, 0, 0, 0, 0) - 5.5 * 60 * 60 * 1000
    )
    const endOfDay = new Date(
      Date.UTC(year, month, day, 23, 59, 59, 999) - 5.5 * 60 * 60 * 1000
    )

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "CANCELLED",
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return orders
  } catch (error) {
    throw new Error(
      `Failed to get today's orders of all restaurants: ${
        (error as Error).message
      }`
    )
  }
}

async function cancelledOrdersByRestaurant(restaurantId: string) {
  try {
    return await prisma.order.findMany({
      where: {
        restaurantId,
        status: "CANCELLED",
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    throw new Error(
      `Failed to get cancelled orders by restaurant: ${
        (error as Error).message
      }`
    )
  }
}

export {
  addOrderItems,
  cancelledOrdersByRestaurant,
  createOrder,
  getAllOrdersByRestaurant,
  getAllOrdersAllRestaurants,
  getOrderWithItemsById,
  getTodayOrdersByRestaurant,
  getTodayOrdersAllRestaurants,
  updateOrder,
}
