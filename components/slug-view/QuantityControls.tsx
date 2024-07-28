import { MouseEvent, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { MenuItemI } from "@/services/menuService"
import { Minus, Plus } from "lucide-react"

import { getPathWithQuery } from "@/lib/utils"
import { useCart } from "@/app/store/CartProvider"

import { addItemToCart, changeItemQuantity } from "./util"

const QuantityControls = ({ item }: { item: MenuItemI }) => {
  const router = useRouter()
  const params = useParams()
  const totalQty = useTotalQty(item.id)
  const setCart = useCart()((state) => state.setCart)

  const handleNavigation = useCallback(() => {
    router.push(getPathWithQuery(`/${params.slug}/${item.id}`))
  }, [item.id, params.slug, router])

  const onAdd = useCallback(
    (event: MouseEvent<HTMLElement>) =>
      addItemToCart(item, setCart, handleNavigation)(event),
    [handleNavigation, item, setCart]
  )

  const handleQuantityChange = useCallback(
    (event: MouseEvent<HTMLElement>, operation: "inc" | "dec") => {
      changeItemQuantity(
        { ...item, quantity: totalQty },
        setCart,
        handleNavigation
      )(event, operation)
    },
    [handleNavigation, item, setCart, totalQty]
  )

  return totalQty ? (
    // <div className="flex items-center justify-end">
    //   <button
    //     className="px-1 font-semibold"
    // onClick={(e) => handleQuantityChange(e, "dec")}
    //   >
    //     <Minus size={14} />
    //   </button>
    //   <p className="px-1.5" onClick={(e) => e.preventDefault()}>
    //     {totalQty}
    //   </p>
    //   <button
    //     className="pl-1 font-semibold"
    // onClick={(e) => handleQuantityChange(e, "inc")}
    //   >
    //     <Plus size={14} />
    //   </button>
    // </div>

    <div className="bg-secondary text-primary flex max-w-max items-center  justify-end space-x-1 rounded-lg border">
      <button className="p-2" onClick={(e) => handleQuantityChange(e, "dec")}>
        <Minus size={14} />
      </button>
      <span className="text-base font-medium">{totalQty}</span>
      <button className="p-2" onClick={(e) => handleQuantityChange(e, "inc")}>
        <Plus size={14} />
      </button>
    </div>
  ) : (
    <button
      className="pr-4 text-xs font-semibold text-orange-300"
      onClick={(e) => onAdd(e)}
    >
      ADD
    </button>
  )
}

export default QuantityControls

function useTotalQty(itemId: string | undefined): number {
  return useCart()((state) => {
    if (!itemId) return 0
    return Object.keys(state.cart).reduce((acc, key) => {
      if (key.includes(itemId as string)) {
        acc += state.cart[key].quantity
      }
      return acc
    }, 0)
  })
}
