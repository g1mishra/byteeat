"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const BackButton = ({ className = "" }) => {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={cn("w-full", className)}
    >
      Go back
    </Button>
  )
}

export default BackButton
