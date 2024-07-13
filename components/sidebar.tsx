"use client"

import React from "react"
import dynamic from "next/dynamic"
import { MenuIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"

const SocailIconMap = {
  facebook: dynamic(() => import("@/components/icons/facebook")),
  twitter: dynamic(() => import("@/components/icons/twitter")),
  instagram: dynamic(() => import("@/components/icons/instagram")),
  whatsapp: dynamic(() => import("@/components/icons/whatsapp")),
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  address?: string
  socials: {
    id: string
    facebook: string
    instagram: string
    twitter: string
    whatsapp: string
    restaurantId: string
  } | null
}

const Social_Map = ["facebook", "twitter", "instagram", "whatsapp"]

export function Sidebar({ className, socials, name, ...props }: SidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <div
        className={cn(
          "hidden min-h-screen flex-col gap-y-2 overflow-y-auto p-4 transition-[all_0.5s_ease-in-out]",
          "fixed inset-0 z-50 ml-[-100%] w-full bg-white dark:bg-gray-800",
          className,
          {
            "ml-0 w-full flex": open,
          }
        )}
        {...props}
      >
        <X
          onClick={() => setOpen(!open)}
          className="absolute right-4 top-4 size-6 text-gray-800 dark:text-white"
        />
        <div className="mt-6 flex h-full flex-col justify-between gap-y-6 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {name}
            </h1>
            <p className="text-sm text-gray-800 dark:text-white">
              {props.address}
            </p>
          </div>
          <div className="flex justify-center gap-x-6">
            {Social_Map?.map((social) => {
              const Icon = SocailIconMap[social as keyof typeof SocailIconMap]
              const url = socials?.[social as keyof typeof socials].trim()
              if (!url) return null
              return (
                <a
                  key={url}
                  href={url}
                  className="text-gray-800 hover:underline dark:text-white"
                >
                  <Icon
                    className={cn("size-9", {
                      "p-0.5": social !== "whatsapp",
                    })}
                  />
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <div
        className={cn("flex flex-col gap-y-2", className, {
          hidden: open,
        })}
        {...props}
      >
        <MenuIcon
          onClick={() => setOpen(!open)}
          className="size-6 text-gray-800 dark:text-white"
        />
      </div>
    </>
  )
}
