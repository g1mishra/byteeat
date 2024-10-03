import React, { useEffect } from "react"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import useMediaQuery from "@/hook/useMediaQuery"

import { Cart } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

type ConfirmOrderModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  addedDishes: Cart[]
  subtotal: number
  discount: number
  total: number
}

export default function ConfirmOrderModal({
  open,
  onClose,
  onConfirm,
  addedDishes,
  subtotal,
  discount,
  total,
}: ConfirmOrderModalProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const { isConnected } = useBluetoothPrinter()

  const content = (
    <React.Fragment>
      <ScrollArea className="h-[60vh] pr-4">
        <h3 className="mb-2 font-semibold">Order Summary:</h3>
        <ul className="space-y-2">
          {addedDishes.map((dish, index) => (
            <li key={index} className="flex justify-between">
              <span>
                {dish.name} {dish.portion && `(${dish.portion})`}
                {dish?.addons?.length
                  ? ` [${dish?.addons?.map((addon) => addon.name).join(", ")}]`
                  : ""}
              </span>
              <span>₹{dish.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>

      {/* // discount */}
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="text-sm">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Discount:</span>
          <span className="text-sm">-₹{(subtotal - total).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </React.Fragment>
  )

  const confirmButtonLabel = isConnected ? "Confirm Order & Print" : "Confirm Order"

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open) {
        if (event.key === "Enter") {
          onConfirm()
        } else if (event.key === "Escape") {
          onClose()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onConfirm, onClose])

  if (isMobile) {
    return (
      <Drawer open={open} onClose={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Your Order</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">{content}</div>
          <DrawerFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>{confirmButtonLabel}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Your Order</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{content}</div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmButtonLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
