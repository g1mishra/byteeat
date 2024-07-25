"use client"

import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { getPathWithQuery } from "@/lib/utils"

const ItemViewHeader = () => {
  const { slug } = useParams()
  return (
    <div className="bg-primary flex h-14 items-center justify-between space-x-2  px-4">
      <Link href={getPathWithQuery(`/${slug}`)} className="text-white">
        <ArrowLeft size={24} />
      </Link>
      <Link href={getPathWithQuery(`/${slug}/view-cart`)}>
        <ShoppingCart className="size-7 cursor-pointer text-white" />
      </Link>
    </div>
  )
}

export default ItemViewHeader
