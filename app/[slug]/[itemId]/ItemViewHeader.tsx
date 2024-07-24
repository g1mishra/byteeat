"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ShoppingCart } from "lucide-react"

const ItemViewHeader = () => {
  const { slug } = useParams()
  return (
    <div className="bg-primary flex h-14 items-center justify-between space-x-2  px-4">
      <Link href={`/${slug}`} className="text-white">
        <ArrowLeft size={24} />
      </Link>
      <Link href={`/${slug}/view-cart`}>
        <ShoppingCart className="size-7 cursor-pointer text-white" />
      </Link>
    </div>
  )
}

export default ItemViewHeader
