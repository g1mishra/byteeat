"use client"

import { useMemo, useRef, useState } from "react"
import { useBluetoothPrinter } from "@/hook/useBluetoothPrinter"
import { addOrderItems, createOrder } from "@/services/order.services"
import { OrderType, Prisma } from "@prisma/client"
import { Drumstick, Leaf, Search, ShoppingCart } from "lucide-react"

import { Cart } from "@/lib/types"
import { generateReceipt } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/use-toast"

import AddedDish from "./AddedDish"
import ConfirmOrderModal from "./ConfirmOrderModal"
import DishList from "./DishList"

const restaurantInclude = Prisma.validator<Prisma.RestaurantInclude>()({
  ItemCategory: {
    select: {
      id: true,
      Item: { include: { PriceItemMap: true } },
      categoryName: true,
    },
  },
})

type Restaurant = Prisma.RestaurantGetPayload<{
  include: typeof restaurantInclude
}>

type QuickOrderProps = {
  restaurant: Restaurant
}

type VegFilter = "all" | "veg" | "non-veg"

export default function QuickOrder({ restaurant }: QuickOrderProps) {
  const [addedDishes, setAddedDishes] = useState<Cart[]>([])
  const [discount, setDiscount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [vegFilter, setVegFilter] = useState<VegFilter>("all")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { handleRequestDevice, isConnected, printOrder } = useBluetoothPrinter()

  const subtotal = useMemo(() => {
    return addedDishes.reduce((total, dish) => total + dish.price * dish.quantity, 0)
  }, [addedDishes])

  const totalPrice = useMemo(() => {
    return subtotal * (1 - Math.min(discount, 100) / 100)
  }, [subtotal, discount])

  function handleAddOrUpdate(dish: Cart, action: "INC" | "DEC") {
    setAddedDishes((prev) => {
      const temp = [...prev]
      const existingDish = temp.find((d) => d.id === dish.id && d.portion === dish.portion)
      if (existingDish) {
        return temp.map((d) =>
          d.id === dish.id && d.portion === dish.portion
            ? { ...d, quantity: d.quantity + (action === "INC" ? 1 : -1) }
            : d
        )
      }
      return [...temp, dish]
    })
  }

  function handleRemoveDish(id: string, portion?: string) {
    setAddedDishes((prev) =>
      prev.filter((d) => {
        if (d.id === id) {
          if (portion) {
            return d.portion !== portion
          }
          return false
        }
        return true
      })
    )
  }

  async function handlePlaceOrder() {
    try {
      const resp = await createOrder(
        restaurant.id,
        0,
        totalPrice,
        OrderType.MANUAL,
        "ACCEPTED",
        subtotal,
        discount
      )
      if (!resp || !resp.id) {
        return {
          success: false,
        }
      }
      const orderItemResp = await addOrderItems(resp.id, addedDishes)
      if (orderItemResp.count === 0) {
        return {
          success: false,
        }
      }

      if (isConnected) {
        const receiptData = generateReceipt(
          restaurant.name,
          addedDishes.map((dish) => ({
            id: dish.id,
            itemId: dish.id,
            orderId: resp.id,
            portion: dish.portion || "",
            quantity: dish.quantity,
            name: dish.name,
            price: dish.price,
            addons: [],
          })),
          subtotal.toFixed(2),
          totalPrice.toFixed(2),
          discount,
          resp?.tableNo || 0
        )
        await printOrder(receiptData)
      }

      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
      })
      setAddedDishes([])
      setIsConfirmModalOpen(false)
      setSheetOpen(false)
      setActiveCategory(null)
      setSearchTerm("")
      setVegFilter("all")
      setDiscount(0)
    } catch (error) {
      console.error("Failed to place order", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCategories = restaurant.ItemCategory.map((category) => ({
    ...category,
    Item: category.Item.filter((item) =>
      item.dish.toLowerCase().includes(searchTerm.toLowerCase()) && vegFilter
        ? vegFilter === "all" ||
          (vegFilter === "veg" && item.isVeg) ||
          (vegFilter === "non-veg" && !item.isVeg)
        : true
    ),
  })).filter((category) => category.Item.length > 0)

  const totalItems = addedDishes.length

  return (
    <div className="relative flex h-full flex-col">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 pt-0 shadow-sm">
        <div
          className="max-w-max cursor-pointer rounded border px-4 py-2 transition-colors hover:bg-gray-100"
          onClick={handleRequestDevice}
        >
          {isConnected ? "Connected ✅" : "Connect to Printer"}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="size-5" />
              {totalItems > 0 && (
                <span className="bg-primary text-primary-foreground absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full text-xs">
                  {totalItems}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <AddedDish
              discount={discount}
              setDiscount={setDiscount}
              onAdd={handleAddOrUpdate}
              addedDishes={addedDishes}
              onRemove={handleRemoveDish}
              totalPrice={totalPrice}
              subtotalPrice={subtotal}
            />
            <Button
              className="mt-4 w-full"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={addedDishes.length === 0}
            >
              Proceed (₹{totalPrice.toFixed(2)})
            </Button>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex h-full flex-1 flex-col md:flex-row">
        <div className="w-full shrink-0 bg-gray-50 p-4 md:w-auto md:rounded-l-lg">
          <ToggleGroup
            variant="outline"
            type="single"
            value={vegFilter}
            onValueChange={(value: VegFilter) => setVegFilter(value)}
            className="mb-4 flex-wrap"
          >
            <ToggleGroupItem value="all" aria-label="Show all dishes">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="veg" aria-label="Show vegetarian dishes">
              <Leaf className="mr-2 size-4" />
              Veg
            </ToggleGroupItem>
            <ToggleGroupItem value="non-veg" aria-label="Show non-vegetarian dishes">
              <Drumstick className="mr-2 size-4" />
              Non-Veg
            </ToggleGroupItem>
          </ToggleGroup>
          <ScrollArea className="max-sm:pb-2 md:h-[calc(100vh-16rem)]">
            <div className="flex flex-row md:flex-col">
              <Button
                variant={activeCategory === null ? "default" : "ghost"}
                className="mb-2 mr-2 whitespace-nowrap md:mr-0 md:w-full md:justify-start"
                onClick={() => setActiveCategory(null)}
              >
                All Categories
              </Button>
              {filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  className="mb-2 mr-2 whitespace-nowrap md:mr-0 md:w-full md:justify-start"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.categoryName}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex grow flex-col p-4 pb-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search dishes... (Press '/' to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
              ref={searchInputRef}
            />
          </div>
          <ScrollArea className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-10rem)]">
            {filteredCategories
              .filter((category) => activeCategory === null || category.id === activeCategory)
              .map((category) => (
                <div key={category.id} className="mb-6">
                  <h3 className="mb-2 text-xl font-semibold">{category.categoryName}</h3>
                  <DishList
                    menu={category}
                    onSelect={handleAddOrUpdate}
                    addedDishes={addedDishes}
                  />
                </div>
              ))}
          </ScrollArea>
        </div>
      </div>
      <ConfirmOrderModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handlePlaceOrder}
        addedDishes={addedDishes}
        total={totalPrice}
        subtotal={subtotal}
        discount={discount}
      />
    </div>
  )
}
