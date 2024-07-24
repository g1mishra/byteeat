"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CheckoutDialog({
  onSubmit,
}: {
  onSubmit: (data: { name: string; phone: string; table: string }) => Promise<{
    success: boolean
    callBack?: () => void
  }>
}) {
  const params = useParams()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [table, setTable] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{
    [key: string]: string
  }>({})

  const router = useRouter()

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
  }

  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Checkout</Button>
      </DialogTrigger>
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
  )
}
