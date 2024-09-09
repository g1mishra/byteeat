import { MenuItemI } from "@/services/menuService"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SelectPortionModalProps = {
  dish: MenuItemI
  open: boolean
  close: () => void
  addDish: (portion: string, dish: MenuItemI) => void
}

export default function SelectPortionModal({
  dish,
  open,
  close,
  addDish,
}: SelectPortionModalProps) {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center gap-6 py-8">
          <img
            src={dish.imgPath || "/placeholder.svg"}
            alt={dish.dish}
            className="rounded-lg"
            width="300"
            height="200"
            style={{ aspectRatio: "300/200", objectFit: "cover" }}
          />
          <DialogHeader>
            <DialogTitle>Select Portion</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{dish.dish}</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {dish.PriceItemMap?.map((menu) => (
                <Button
                  onClick={() => addDish(menu.portion, dish)}
                  variant="outline"
                >
                  {menu.portion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
