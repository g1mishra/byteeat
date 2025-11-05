"use client"

import { Badge } from "@/components/ui/badge"
import { fromatDate } from "@/lib/dateUtils"
import { getOrderToken } from "@/lib/utils"
import { OrderWithItems } from "@/services/order.services"
import { OrderItem } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface OrderViewProps {
  orderDetails: OrderWithItems
  theme?: {
    buttonStyle: "rounded" | "square" | "pill"
    primaryColor: string
    secondaryColor: string
  }
}

export default function OrderView({ orderDetails, theme }: OrderViewProps) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
      if (["accepted", "delivered", "cancelled"].includes(orderDetails?.status?.toLowerCase())) {
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [router, orderDetails?.status])

  if (!orderDetails) return null

  const buttonClasses =
    theme?.buttonStyle === "pill"
      ? "rounded-full"
      : theme?.buttonStyle === "square"
        ? "rounded-none"
        : "rounded-md"

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div
        className={`p-4 ${buttonClasses}`}
        style={{
          backgroundColor: theme?.primaryColor,
          color: theme?.secondaryColor,
        }}
      >
        {renderStatusContent(orderDetails)}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className={`rounded-md border bg-white p-4 shadow-sm ${buttonClasses}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order Details</h2>
            <Badge
              variant="secondary"
              className={`px-3 py-1 text-xs capitalize ${buttonClasses}`}
              style={{
                backgroundColor: theme?.primaryColor,
                color: theme?.secondaryColor,
              }}
            >
              {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
            </Badge>
          </div>
          <OrderInfo orderDetails={orderDetails} />
        </div>
        <div className={`rounded-md border bg-white p-4 shadow-sm ${buttonClasses}`}>
          <h3 className="mb-2 text-xl font-bold">Order Items</h3>
          <OrderItems items={orderDetails.orderItems} />
          <OrderTotals total={orderDetails.total} />
        </div>
      </div>
    </div>
  )
}

const renderStatusContent = (orderDetails: any) => {
  const orderToken = getOrderToken(orderDetails.id)

  switch (orderDetails?.status?.toLowerCase()) {
    case "pending":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
          <PackageIcon className="size-12 text-blue-500" />
          <h2 className="text-2xl font-bold">Order Pending</h2>
          <h3>
            Order Token: <span className="font-bold uppercase">{orderToken}</span>
          </h3>
          <p className="text-center text-gray-600">
            Your order has been placed and is awaiting confirmation.
          </p>
        </div>
      )
    case "delivered":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
          <PackageIcon className="size-12 text-green-500" />
          <h2 className="text-2xl font-bold">Order Delivered</h2>
          <h3>
            Order Token: <span className="font-bold uppercase">{orderToken}</span>
          </h3>
          <p className="text-center text-gray-600">Your order has been delivered successfully.</p>
        </div>
      )
    case "cancelled":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
          <PackageIcon className="size-12 text-red-500" />
          <h2 className="text-2xl font-bold">Order Cancelled</h2>
          <h3>
            Order Token: <span className="font-bold uppercase">{orderToken}</span>
          </h3>
          <p className="text-center text-gray-600">Your order has been cancelled.</p>
        </div>
      )
    case "accepted":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
          <PackageIcon className="size-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Order Accepted</h2>
          <h3>
            Order Token: <span className="font-bold uppercase">{orderToken}</span>
          </h3>
          <p className="text-center text-gray-600">
            Your order has been accepted and is being prepared.
          </p>
        </div>
      )
    default:
      return null
  }
}

function OrderInfo({ orderDetails }: { orderDetails: OrderWithItems }) {
  return (
    <div className="grid gap-3">
      <OrderDetail label="Order Id" value={orderDetails.id} />
      <OrderDetail label="Date" value={fromatDate(orderDetails.createdAt)} />
      <OrderDetail label="Table #" value={orderDetails.tableNo} />
    </div>
  )
}

function OrderDetail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-x-2">
      <span className="shrink-0 text-gray-600">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}

function OrderItems({ items }: { items: OrderItem[] | undefined }) {
  return (
    <div className="grid gap-3">
      {items?.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <span>{item.name}</span>
          <span>
            {item.quantity} x {item.price}
          </span>
        </div>
      ))}
    </div>
  )
}

function OrderTotals({ total }: { total: number }) {
  return (
    <div className="mt-4">
      <OrderTotal label="Total" value={`${total.toFixed(2)}`} bold />
    </div>
  )
}

function OrderTotal({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-bold" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
