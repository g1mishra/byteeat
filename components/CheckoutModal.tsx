"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import useMediaQuery from "@/hook/useMediaQuery"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CheckoutDialog({
  onSubmit,
  isOpen,
  setIsOpen,
}: {
  onSubmit: (data: { name: string; phone: string; table: string }) => Promise<{
    success: boolean
    callBack?: () => void
  }>
  isOpen?: boolean
  setIsOpen: (open: boolean) => void
}) {
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [table, setTable] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ [key: string]: string }>({})

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const clearState = () => {
    setName("")
    setPhone("")
    setTable("")
    setLoading(false)
    setError({})
  }

  useEffect(() => {
    if (!searchParams) return
    const tableNo = searchParams.get("tableNumber")
    if (!tableNo) return
    setTable(tableNo || "")

    return () => {
      clearState()
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!table) {
      setError((prev) => ({ ...prev, table: "Table number is required" }))
      return
    }
    setLoading(true)
    const resp = await onSubmit({ name, phone, table })
    if (resp?.success) {
      resp?.callBack?.()
    }
    setLoading(false)
    setIsOpen(false)
  }

  return (
    <>
      {isDesktop ? (
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
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-10 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="8989898989"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="table">Table #</Label>
                  <Input
                    id="table"
                    placeholder="12"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                  />
                  {error.table && (
                    <p className="text-sm text-red-500">{error.table}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">Complete Checkout</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Checkout</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="max-h-[90vh] w-full overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="8989898989"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="table">Table #</Label>
                  <Input
                    id="table"
                    placeholder="12"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                  />
                  {error.table && (
                    <p className="text-sm text-red-500">{error.table}</p>
                  )}
                </div>
                <Button type="submit">Complete Checkout</Button>
              </form>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
