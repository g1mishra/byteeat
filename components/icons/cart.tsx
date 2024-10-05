import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ShoppingCart } from "lucide-react"

import { getBasePath } from "@/lib/utils"
import { useCart } from "@/app/store/CartProvider"

export default function CartIcon() {
  const { slug } = useParams()
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get("tableNumber")
  const { total } = useCart()((state) => state)
  return (
    <Link
      href={`/view-cart${tableNumber ? `?tableNumber=${tableNumber}` : ""}`}
      className="relative py-2 text-white"
    >
      <div className="absolute -right-0.5 top-0">
        {total?.quantity > 0 ? (
          <p className="text-primary flex size-1 items-center justify-center rounded-full bg-green-400 p-2.5 text-xs">
            {total?.quantity}
          </p>
        ) : null}
      </div>
      <ShoppingCart className="size-7" />
    </Link>
  )
}
