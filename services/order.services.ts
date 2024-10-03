"use server"

import { Order, OrderItem, OrderStatus, OrderType, Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import { getStartAndEndOfDay } from "@/lib/dateUtils"
import prisma from "@/lib/prisma"
import { Cart } from "@/lib/types"
import { authOptions } from "@/app/api/auth/authOption"

export type OrderWithItems = Order & { orderItems?: OrderItem[] }

// Create a new order
async function createOrder(
  restaurantId: string,
  tableNo: number,
  total = 0,
  type: OrderType,
  status: OrderStatus = "PENDING",
  subtotal = 0,
  discount = 0
): Promise<Order> {
  try {
    const resp = await prisma.userRestaurant.findFirst({
      where: {
        restaurantId,
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
        status: status || "PENDING",
        total,
        subtotal: subtotal || total,
        discount,
        tableNo,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        type,
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
  try {
    const orderItems = await prisma.$transaction(
      items.map((item) =>
        prisma.orderItem.create({
          data: {
            orderId,
            name: item.name,
            itemId: item.id,
            portion: item.portion || "",
            price: item.price,
            quantity: item.quantity,
            addons: {
              create: item.addons?.map((addon) => ({
                addonId: addon.id,
                quantity: 1,
              })),
            },
          },
        })
      )
    )

    return { count: orderItems.length }
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
    throw new Error(`Failed to get orders by restaurant: ${(error as Error).message}`)
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
    throw new Error(`Failed to get all orders of all restaurants: ${(error as Error).message}`)
  }
}

// Get order by ID
async function getOrderWithItemsById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            addons: {
              include: {
                addon: true,
              },
            },
          },
        },
      },
    })

    if (!order) return null

    // Pre-calculate totals including addons
    const orderWithTotals = {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        totalPrice:
          item.price * item.quantity +
          item.addons.reduce((sum, addon) => sum + addon.addon.price * addon.quantity, 0),
        addons: item.addons.map((addon) => ({
          ...addon,
          totalPrice: addon.addon.price * addon.quantity,
        })),
      })),
      itemsTotal: order.orderItems.reduce(
        (sum, item) =>
          sum +
          item.price * item.quantity +
          item.addons.reduce((addonSum, addon) => addonSum + addon.addon.price * addon.quantity, 0),
        0
      ),
    }

    return orderWithTotals
  } catch (error) {
    throw new Error(`Failed to get order by ID: ${(error as Error).message}`)
  }
}

async function getTodayOrdersByRestaurant(
  restaurantId: string,
  timestamp: string // ISO string (UTC)
) {
  try {
    // Parse the input timestamp from ISO string (UTC)
    const utcTimestamp = new Date(timestamp)

    // Get UTC year, month, and day
    const year = utcTimestamp.getUTCFullYear()
    const month = utcTimestamp.getUTCMonth()
    const day = utcTimestamp.getUTCDate()

    // Create start and end of the day in UTC
    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999))

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
    throw new Error(`Failed to get today's orders by restaurant: ${(error as Error).message}`)
  }
}

async function getTodayOrdersAllRestaurants(timestamp: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User ID is required")
    }

    const { startOfDay, endOfDay } = getStartAndEndOfDay(timestamp)

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
    throw new Error(`Failed to get today's orders of all restaurants: ${(error as Error).message}`)
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
    throw new Error(`Failed to get cancelled orders by restaurant: ${(error as Error).message}`)
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
