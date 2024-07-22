"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/app/store/CartProvider"

const AddToCart = ({ response }: { response: any }) => {
  const { cart, setCart } = useCart()((state) => state)

  const addToCart = (priceItem: any, type: "inc" | "dec") => {
    const item = cart.find(
      (item) =>
        item.id === response?.id &&
        (item.portion || null) === (priceItem.portion || null)
    )
    const newCart = item
      ? cart.map((cartItem) =>
          cartItem.id === item.id &&
          (cartItem.portion || null) === (item.portion || null)
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (type === "inc" ? 1 : -1),
              }
            : cartItem
        )
      : [
          ...cart,
          {
            id: response?.id,
            name: response?.dish,
            price: priceItem.price || 0,
            quantity: 1,
            portion: priceItem.portion || null,
          },
        ]
    setCart(newCart)
  }

  return (
    <div className="flex flex-col justify-between">
      <div>
        <h3 className="mb-2 text-2xl font-bold">{response?.dish}</h3>
        <p className="text-muted-foreground mb-4">{response?.description}</p>
        <div className="mb-4 flex flex-col items-start justify-between space-y-4">
          {response?.PriceItemMap?.map((priceItem: any, index: number) => {
            const item = cart.find(
              (item) =>
                item.id === response?.id &&
                (item.portion || null) === (priceItem.portion || null)
            )

            return (
              <div
                key={index}
                className="flex w-full items-center justify-between rounded-md border p-4"
              >
                <div className="flex flex-col">
                  {priceItem.portion && (
                    <div className="text-muted-foreground">
                      {priceItem.portion}
                    </div>
                  )}
                  <div className="text-lg font-medium">{priceItem.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => addToCart(priceItem, "dec")}
                    disabled={item?.quantity === 1}
                  >
                    -
                  </Button>
                  <p className="mx-1">{item?.quantity}</p>
                  <Button onClick={() => addToCart(priceItem, "inc")}>+</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AddToCart
