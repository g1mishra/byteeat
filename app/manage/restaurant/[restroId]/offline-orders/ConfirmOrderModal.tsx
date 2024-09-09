import useMediaQuery from "@/hook/useMediaQuery"
import { MenuItemI } from "@/services/menuService"

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
import { Cart } from "@/lib/types"

type ConfirmOrderModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  addedDishes: Cart[]
}

export default function ConfirmOrderModal({
  open,
  onClose,
  onConfirm,
  addedDishes,
}: ConfirmOrderModalProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  const totalPrice = addedDishes.reduce(
    (total, dish) => total + (dish?.price ?? 0),
    0
  )

  const content = (
    <>
      <ScrollArea className="h-[60vh] pr-4">
        <h3 className="mb-2 font-semibold">Order Summary:</h3>
        <ul className="space-y-2">
          {addedDishes.map((dish, index) => (
            <li key={index} className="flex justify-between">
              <span>
                {dish.name}{" "}
                {dish.portion && `(${dish.portion})`}
              </span>
              <span>₹{dish.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="mt-4 flex justify-between font-semibold">
        <span>Total:</span>
        <span>₹{totalPrice.toFixed(2)}</span>
      </div>
    </>
  )

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
            <Button onClick={onConfirm}>Confirm Order</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Order</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{content}</div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
