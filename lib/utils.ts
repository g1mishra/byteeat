import { Order, OrderItem } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any) => any>(func: T, waitFor: number) {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), waitFor)
  }
}

export const BaseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN
export function getBasePath(slug = "") {
  if (!slug) {
    return BaseDomain?.includes("localhost") ? `http://${BaseDomain}` : `https://${BaseDomain}`
  }
  return BaseDomain?.includes("localhost")
    ? `http://${slug}.${BaseDomain}`
    : `https://${slug}.${BaseDomain}`
}

export const getPathWithQuery = (href: string): string => {
  if (typeof window === "undefined") return href
  const searchParams = new URLSearchParams(window.location.search)
  let url: URL

  if (href.startsWith("http")) {
    url = new URL(href)
  } else {
    url = new URL(href, window.location.origin)
  }

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  return url.pathname + url.search
}

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "logout",
  "register",
  "settings",
  "pricing",
  "manage",
  "docs",
  "blog",
  "contact",
  "privacy",
  "terms",
  "404",
  "500",
  "demo",
]

export const generateWaiterKey = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""
  for (let i = 0; i < 6; i++) {
    key += characters[Math.floor(Math.random() * characters.length)]
  }
  return key
}

export const generateReceipt = (
  slug: string | undefined,
  orderItems: (OrderItem & { addons: { id: string; name: string; price: number }[] })[],
  subtotal: string,
  total: string,
  discount: number,
  tableNo: number
): string => {
  const width = 32
  const line = "-".repeat(width) + "\n"
  const center = (text: string) => text.padStart((width + text.length) / 2).padEnd(width)
  const right = (text: string) => text.padStart(width)

  const header = line
  const restaurantName = center(slug?.replace("-", " ").toUpperCase() || "") + "\n"
  const dineInInfo = `Table: ${tableNo === 0 ? "N/A" : tableNo}\n`
  const subtotalInfo = right(`Subtotal: Rs. ${subtotal}`) + "\n"
  const discountInfo = discount > 0 ? right(`Discount: ${discount}%`) + "\n" : ""
  const totalInfo = right(`Total: Rs. ${total}`) + "\n"

  const itemsInfo =
    orderItems
      ?.map((item: OrderItem) => {
        const itemName = item.name.length > 20 ? item.name.slice(0, 17) + "..." : item.name
        let itemDetails = itemName

        if (item.portion) {
          itemDetails += ` (${item.portion})`
        }

        if ("addons" in item && Array.isArray(item.addons) && item.addons.length > 0) {
          const addonNames = item.addons.map((addon: { name: string }) => addon.name).join(", ")
          itemDetails += ` [${addonNames}]`
        }

        const itemLine =
          itemDetails.length > width ? itemDetails.slice(0, width - 3) + "..." : itemDetails
        const quantityPrice = right(`${item.quantity}x ${item.price.toFixed(2)}`)

        return `${itemLine}\n${quantityPrice}\n`
      })
      .join("\n") || ""

  const currentDate = new Date().toLocaleString()
  const dateInfo = center(currentDate) + "\n"
  const cutLine = "\n" + center("- - - - - - - - - - - - - - - -") + "\n\n"

  return `${header}${restaurantName}${header}${dineInInfo}${line}${itemsInfo}${line}${subtotalInfo}${discountInfo}${totalInfo}${line}${dateInfo}${cutLine}\n`
}

export function getOrderToken(orderId: string, length: number = 6): string {
  return orderId.slice(-length)
}

export type SerializedOrder = Omit<Order, "total"> & { total: string }
export function serializeOrder(order: Order): SerializedOrder {
  return {
    ...order,
    total: order.total.toString(),
  }
}
