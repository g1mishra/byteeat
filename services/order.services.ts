import { Order, OrderItem } from "@prisma/client"
import { Part } from "aws-sdk/clients/s3"

import prisma from "@/lib/prisma"

type OrderWithItems = Order & { orderItems?: OrderItem[] }

// Create a new order
async function createOrder(
  restaurantId: string,
  tableNo: number,
  total = 0
): Promise<Order> {
  try {
    return await prisma.order.create({
      data: {
        restaurantId,
        status: "pending",
        total,
        tableNo,
        createdAt: new Date(),
        updatedAt: new Date(),
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
async function addOrderItems(
  orderId: string,
  items: {
    item: string
    itemId: string
    portion: string
    price: number
    quantity: number
  }[]
): Promise<void> {
  const data = items.map(({ item, itemId, portion, price, quantity }) => ({
    item,
    itemId,
    portion,
    price,
    quantity,
    orderId,
  }))

  try {
    await prisma.orderItem.createMany({
      data,
    })
  } catch (error) {
    throw new Error(`Failed to add order items: ${(error as Error).message}`)
  }
}

// Get all orders by restaurant
async function getAllOrdersByRestaurant(
  restaurantId: string
): Promise<OrderWithItems[]> {
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

// Get order by ID
async function getOrderWithItemsById(
  orderId: string
): Promise<OrderWithItems | null> {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
    })
  } catch (error) {
    throw new Error(`Failed to get order by ID: ${(error as Error).message}`)
  }
}

export {
  createOrder,
  addOrderItems,
  updateOrder,
  getAllOrdersByRestaurant,
  getOrderWithItemsById,
}
