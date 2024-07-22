"use client"

import { useState } from "react"
import {
  addOrderItem,
  createOrder,
  updateOrderTotal,
} from "@/services/order.services"

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

import { ItemsForOrder } from "./type"

type CartProps = {
  cart: ItemsForOrder[]
  tableNo: number | undefined
  restaurantId: string | undefined
  setCart: React.Dispatch<React.SetStateAction<ItemsForOrder[]>>
}

const Cart: React.FC<CartProps> = ({
  cart,
  tableNo,
  restaurantId,
  setCart,
}) => {
  const [ordered, setOrdered] = useState(false)
  const cartCopy = cart
  async function orderClick(
    restaurantId: string,
    cart: ItemsForOrder[],
    total: number,
    tableNo: number
  ) {
    const order = await createOrder(restaurantId, tableNo)

    console.log(order)
    cart.map((item) => {
      addOrderItem(
        order.id,
        item.dish,
        item.itemId ?? "",
        item.portion ?? "",
        item.price ?? 0,
        item.quantity
      )
    })

    await updateOrderTotal(order.id, total)
    setOrdered(true)
    setCart([])
  }

  const total = cart.reduce((acc, curr) => acc + curr.quantity, 0)

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * (curr.price ?? 0),
    0
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cart {total > 0 ? total : ""}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order here!</DialogTitle>
          <DialogDescription>
            {total === 0 && ordered === false && <p>Your cart is empty</p>}
            {ordered === true && <p>Order Placed</p>}

            {ordered === false &&
              total > 0 &&
              cart.map((item) => (
                <div key={item.itemId}>
                  <h2>{item.dish}</h2>
                  <p>
                    Quantity: {item.quantity} Price: {item.price}
                  </p>
                  <h2>Total: {totalPrice}</h2>
                </div>
              ))}
          </DialogDescription>
        </DialogHeader>
        {total > 0 && ordered === false ? (
          <DialogFooter>
            <Button
              type="submit"
              onClick={() =>
                orderClick(restaurantId ?? "", cart, totalPrice, tableNo ?? 0)
              }
            >
              Order
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default Cart
