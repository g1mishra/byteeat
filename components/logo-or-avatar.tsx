"use client"

import React from "react"
import Image from "next/image"

import { avatarName } from "@/lib/string"
import { cn } from "@/lib/utils"

type Props = {
  name: string
  src?: string
  className?: string
}
const LogoOrAvatar = ({ name, src, className = "" }: Props) => {
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
    <div className="flex size-14 items-center justify-center rounded-full bg-gray-200">
      <span className="font-bold uppercase text-gray-600">
        {avatarName(name)}
      </span>
    </div>
  )
}

export default LogoOrAvatar
