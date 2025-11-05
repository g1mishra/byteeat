"use client"

import { avatarName } from "@/lib/string"
import { cn } from "@/lib/utils"
import Image from "next/image"
import React from "react"

type Props = {
  name: string
  src?: string
  className?: string
  theme?: {
    primaryColor: string
  }
}
const LogoOrAvatar = ({ name, src, className = "", theme }: Props) => {
  const [error, setError] = React.useState(false)

  if (src && !error) {
    return (
      <Image
        width={500}
        height={500}
        className={cn("w-full object-contain", className)}
        src={src}
        alt={name}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div
      style={{ backgroundColor: theme?.primaryColor }}
      className="flex size-14 items-center justify-center rounded-full bg-gray-200"
    >
      <span className="font-bold uppercase text-gray-600">{avatarName(name)}</span>
    </div>
  )
}

export default LogoOrAvatar
