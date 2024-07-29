"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ShoppingCart } from "lucide-react"

import { getPathWithQuery } from "@/lib/utils"
import CartIcon from "@/components/icons/cart"

const ItemViewHeader = () => {
  const { slug } = useParams()
  return (
    <div className="bg-primary flex h-14 items-center justify-between space-x-2  px-4">
      <Link href={getPathWithQuery(`/${slug}`)} className="text-white">
        <ArrowLeft size={24} />
      </Link>
      <CartIcon />
    </div>
  )
}

export default ItemViewHeader
