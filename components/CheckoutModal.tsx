"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import useMediaQuery from "@/hook/useMediaQuery"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

interface CheckoutDialogProps {
  onSubmit: (data: {
    name: string
    phone: string
    table: string
  }) => Promise<{ success: boolean; callBack?: () => void }>
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function CheckoutDialog({ onSubmit, isOpen, setIsOpen }: CheckoutDialogProps) {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({ name: "", phone: "", table: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ [key: string]: string }>({})

  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const tableNo = searchParams?.get("tableNumber")
    if (tableNo) setFormData((prev) => ({ ...prev, table: tableNo }))
    return () => setFormData({ name: "", phone: "", table: "" })
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "table") setError({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.table) {
      setError({ table: "Table number is required" })
      return
    }
    setLoading(true)
    const resp = await onSubmit(formData)
    if (resp?.success) resp.callBack?.()
    setLoading(false)
    setIsOpen(false)
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {["name", "phone", "table"].map((field) => (
        <div key={field} className="grid gap-1.5">
          <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
          <Input
            id={field}
            placeholder={field === "name" ? "John Doe" : field === "phone" ? "8989898989" : "12"}
            value={formData[field as keyof typeof formData]}
            onChange={handleInputChange}
          />
          {error[field] && <p className="text-sm text-red-500">{error[field]}</p>}
        </div>
      ))}
      <Button type="submit">Complete Checkout</Button>
    </form>
  )

  const content = loading ? (
    <div className="flex h-32 items-center justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>
  ) : (
    renderForm()
  )

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            {loading
              ? "Please wait while we process your order..."
              : "Please enter your information to complete the checkout process."}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Checkout</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="max-h-[90vh] w-full overflow-y-auto p-4">{content}</ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
