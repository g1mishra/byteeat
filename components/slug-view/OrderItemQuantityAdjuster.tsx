import { cn } from "@/lib/utils"
import React from "react"

import QuantityActionButton from "../QuantityActionBtn"
import { QuantityControlAction } from "./util"

interface OrderItemQuantityAdjusterProps {
  quantity: number
  className?: string
  addBtnClassName?: string
  onQuantityChange: (action: QuantityControlAction) => void
  theme?: {
    buttonStyle: "rounded" | "square" | "pill"
    primaryColor: string
    secondaryColor: string
  }
}

const OrderItemQuantityAdjuster = ({
  quantity,
  className = "",
  addBtnClassName = "",
  onQuantityChange,
  theme,
}: OrderItemQuantityAdjusterProps) => {
  const buttonClasses =
    theme?.buttonStyle === "pill"
      ? "rounded-full"
      : theme?.buttonStyle === "square"
        ? "rounded-none"
        : "rounded-md"

  return (
    <React.Fragment>
      {quantity > 0 ? (
        <QuantityActionButton
          currentValue={quantity}
          onAction={(action) => onQuantityChange(action)}
          buttonSize="compact"
        />
      ) : (
        <button
          className={cn("px-4 py-1 text-xs font-semibold", buttonClasses, addBtnClassName)}
          style={{
            backgroundColor: theme?.primaryColor,
            color: theme?.secondaryColor,
          }}
          onClick={() => onQuantityChange(QuantityControlAction.INCREMENT)}
        >
          ADD
        </button>
      )}
    </React.Fragment>
  )
}

export default OrderItemQuantityAdjuster
