import React from "react"

import NonVegIcon from "./icons/nonveg"
import VegIcon from "./icons/veg"

type VegOrNonVegProps = {
  isVeg: boolean
} & React.ComponentPropsWithoutRef<"div">

const VegOrNonVeg = ({ isVeg, ...rest }: VegOrNonVegProps) => {
  if (isVeg === undefined) {
    return null
  }
  return <div {...rest}>{isVeg ? <VegIcon /> : <NonVegIcon />}</div>
}

export default VegOrNonVeg
