"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OrderWithItems } from "@/services/order.services"
import { OrderItem } from "@prisma/client"

import { Badge } from "@/components/ui/badge"

export default function OrderView({
  orderDetails,
}: {
  orderDetails: OrderWithItems
}) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
      if (orderDetails?.status === "accepted") {
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [router, orderDetails?.status])

  if (!orderDetails) return null

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {orderDetails.status === "pending" ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
          <PackageIcon className="w-12 h-12 text-blue-500" />
          <h2 className="text-2xl font-bold">Order Pending</h2>
          <h3>
            Order ID: <span className="font-bold">{orderDetails.id}</span>
          </h3>
          <p className="text-gray-600">
            Your order has been placed and is awaiting confirmation.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="rounded-md border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs capitalize"
              >
                {orderDetails.status.charAt(0).toUpperCase() +
                  orderDetails.status.slice(1)}
              </Badge>
            </div>
            <OrderInfo orderDetails={orderDetails} />
          </div>
          <div className="rounded-md border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">Order Items</h3>
            <OrderItems items={orderDetails.orderItems} />
            <OrderTotals
              // subtotal={orderDetails.subtotal}
              // tax={orderDetails.tax}
              total={orderDetails.total}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function OrderInfo({ orderDetails }: { orderDetails: OrderWithItems }) {
  return (
    <div className="grid gap-3">
      <OrderDetail label="Order #" value={orderDetails.id} />
      <OrderDetail
        label="Date"
        value={new Date(orderDetails.createdAt).toDateString()}
      />
      {/* <OrderDetail label="Customer" value={orderDetails?.name} /> */}
      {/* <OrderDetail label="Phone" value={orderDetails?.phone} /> */}
      <OrderDetail label="Table #" value={orderDetails.tableNo} />
    </div>
  )
}

function OrderDetail({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function OrderItems({ items }: { items: OrderItem[] | undefined }) {
  return (
    <div className="grid gap-3">
      {items?.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <span>{item.item}</span>
          <span>{item.price}</span>
        </div>
      ))}
    </div>
  )
}

function OrderTotals({
  subtotal,
  tax,
  total,
}: {
  subtotal?: number
  tax?: number
  total: number
}) {
  return (
    <div className="mt-4">
      {subtotal && (
        <OrderTotal label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
      )}
      {tax && <OrderTotal label="Tax" value={`$${tax.toFixed(2)}`} />}
      <OrderTotal label="Total" value={`$${total.toFixed(2)}`} bold />
    </div>
  )
}

function OrderTotal({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between ${bold ? "font-bold" : ""}`}
    >
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
