"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/app/store/CartProvider"

const AddToCart = ({ response }: { response: any }) => {
  const { cart, setCart } = useCart()((state) => state)

  if (!response?.PriceItemMap) return null

  const mappedData = response?.PriceItemMap?.map((priceItem: any) => {
    const item = cart.find(
      (item) =>
        item.id === response.id &&
        (!priceItem.portion || item.portion === priceItem.portion)
    )

    return {
      id: response.id,
      name: response.dish,
      price: priceItem.price || 0,
      quantity: item?.quantity || 0,
      portion: priceItem.portion || null,
    }
  })

  const handleCartUpdate = (item: any, operation: "inc" | "dec") => {
    setCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        portion: item.portion,
      },
      operation
    )
  }

  return (
    <div className="mb-4 flex flex-col items-start justify-between space-y-4">
      {mappedData.map((item: any, index: number) => (
        <div
          key={index}
          className="flex w-full items-center justify-between border-b p-4"
        >
          <div className="flex flex-col">
            <div className="text-muted-foreground">
              {item.portion ? `${item.name} - ${item.portion}` : item.name}
            </div>
            <div className="text-lg font-bold text-gray-800">₹{item.price}</div>
          </div>
          {/* <div className="flex items-center gap-2">
            {item.quantity ? (
              <>
                <button
                  className="size-8 rounded bg-black px-2 py-1 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleCartUpdate(item, "dec")}
                >
                  -
                </button>
                <p className="size-8 px-2 py-1 text-center text-lg font-medium">
                  {item.quantity}
                </p>
                <button
                  className="size-8 rounded bg-black px-2 py-1 font-semibold text-white hover:bg-gray-800"
                  onClick={() => handleCartUpdate(item, "inc")}
                >
                  +
                </button>
              </>
            ) : (
              <Button
                className="w-24"
                onClick={() =>
                  handleCartUpdate({ ...item, quantity: 1 }, "inc")
                }
              >
                Add
              </Button>
            )}
          </div> */}
          <div className="flex items-center space-x-2">
            {item.quantity ? (
              <>
                <button
                  className="flex size-8 items-center justify-center rounded-full bg-red-500 text-white"
                  onClick={() => handleCartUpdate(item, "dec")}
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white"
                  onClick={() => handleCartUpdate(item, "inc")}
                >
                  <Plus size={16} />
                </button>
              </>
            ) : (
              <Button
                className="w-24 rounded-lg px-4 py-2 text-white"
                onClick={() =>
                  handleCartUpdate({ ...item, quantity: 1 }, "inc")
                }
              >
                Add
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddToCart
