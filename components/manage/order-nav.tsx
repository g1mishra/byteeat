"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const OrderNav = ({
  hrefsAndLinks,
}: {
  hrefsAndLinks: { href: string; text: string }[]
}) => {
  const pathname = usePathname()
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row">
      <nav className="flex flex-col gap-2 rounded-lg bg-gray-100 p-2 sm:flex-row">
        {hrefsAndLinks.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              "hover:bg-primary hover:text-primary-foreground",
              {
                "bg-primary text-primary-foreground": item.href === pathname,
                "text-gray-700": item.href !== pathname,
              }
            )}
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default OrderNav
