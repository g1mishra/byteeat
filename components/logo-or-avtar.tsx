import React from "react"
import Image from "next/image"

import { avatarName } from "@/lib/string"

type Props = {
  name: string
  src?: string
}
const LogoOrAvtar = ({ name, src }: Props) => {
  if (src) {
    return (
      <Image
        className="max-h-32 w-full rounded-full object-contain"
        src={src}
        alt={name}
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

export default LogoOrAvtar
