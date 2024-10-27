import React from "react"

import { cn } from "@/lib/utils"

import QuantityActionButton from "../QuantityActionBtn"
import { QuantityControlAction } from "./util"

const OrderItemQuantityAdjuster = ({
  quantity,
  className = "",
  addBtnClassName = "",
  onQuantityChange,
}: {
  quantity: number
  className?: string
  addBtnClassName?: string
  onQuantityChange: (action: QuantityControlAction) => void
}) => {
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
          className={cn("pr-4 text-xs font-semibold text-orange-300", addBtnClassName)}
          onClick={() => onQuantityChange(QuantityControlAction.INCREMENT)}
        >
          ADD
        </button>
      )}
    </React.Fragment>
  )
}

export default OrderItemQuantityAdjuster
