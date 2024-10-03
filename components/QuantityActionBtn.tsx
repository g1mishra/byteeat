import React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

import { QuantityControlAction } from "./slug-view/util"

type ButtonSize = "compact" | "normal"

interface QuantityActionButtonProps {
  currentValue: number
  onAction: (action: QuantityControlAction) => void
  buttonSize?: ButtonSize
  customClassName?: string
}

const QuantityActionButton: React.FC<QuantityActionButtonProps> = ({
  currentValue,
  onAction,
  buttonSize = "normal",
  customClassName,
}) => {
  const sizeClasses = {
    compact: "h-8 min-w-[80px] text-sm",
    normal: "h-10 min-w-[100px] text-base",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between overflow-hidden rounded-md border border-green-500/50 bg-green-50",
        sizeClasses[buttonSize],
        customClassName
      )}
    >
      <button
        className="flex h-full flex-1 items-center justify-center rounded-l-md text-green-600 transition-colors hover:bg-green-100"
        onClick={() => onAction(QuantityControlAction.DECREMENT)}
      >
        <Minus size={buttonSize === "normal" ? 20 : 16} className="stroke-current" />
      </button>
      <span className="flex-1 text-center font-medium text-green-700">{currentValue}</span>
      <button
        className="flex h-full flex-1 items-center justify-center rounded-r-md text-green-600 transition-colors hover:bg-green-100"
        onClick={() => onAction(QuantityControlAction.INCREMENT)}
      >
        <Plus size={buttonSize === "normal" ? 20 : 16} className="stroke-current" />
      </button>
    </div>
  )
}

export default QuantityActionButton
