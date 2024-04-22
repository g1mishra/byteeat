"use client"

import React from "react"
import dynamic from "next/dynamic"
import { MenuIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"

const SocailIconMap = {
  facabook: dynamic(() => import("@/components/icons/facebook")),
  twitter: dynamic(() => import("@/components/icons/twitter")),
  instagram: dynamic(() => import("@/components/icons/instagram")),
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  address?: string
  socials?: {
    url: string
    type: keyof typeof SocailIconMap
  }[]
}

const socials = [
  {
    url: "https://facebook.com",
    type: "facabook",
  },
  {
    url: "https://twitter.com",
    type: "twitter",
  },
  {
    url: "https://instagram.com",
    type: "instagram",
  },
]

export function Sidebar({ className, name, ...props }: SidebarProps) {
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
            {socials?.map((social) => {
              const Icon =
                SocailIconMap[social.type as keyof typeof SocailIconMap]
              return (
                <a
                  key={social.url}
                  href={social.url}
                  className="text-gray-800 hover:underline dark:text-white"
                >
                  <Icon className="size-8" />
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
          className="absolute left-4 top-4 size-6 text-gray-800 dark:text-white"
        />
      </div>
    </>
  )
}
