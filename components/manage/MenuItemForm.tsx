"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  addMenuItemHelper,
  deleteMenuItemHelper,
  updateMenuItemHelper,
} from "@/services/helper.service"
import { MenuItemI, fetchRestaurantAddons } from "@/services/menuService"
import { zodResolver } from "@hookform/resolvers/zod"
import { ItemType } from "@prisma/client"
import { PlusIcon, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

import CenterLoading from "../center-loading"
import UploadItemImage from "./upload-item-image"
import uploadImage from "./utils/uploadImage"

const PriceItemMap = z
  .array(
    z.object({
      price: z.preprocess((x) => {
        if (x === "" || x === undefined || x === null) return 0
        const num = Number(x)
        return isNaN(num) ? 0 : num
      }, z.number().min(1, { message: "Price must be at least 1." })),
      portion: z.string().optional(),
      id: z.string().optional(),
      itemId: z.string().optional(),
    })
  )
  .min(1, { message: "At least one price is required." })
  .refine(
    (items) => {
      if (items.length === 1) return items[0].price >= 1
      return items.every((item) => item.price >= 1 && item.portion?.trim())
    },
    {
      message: "Invalid price or missing portion.",
    }
  )
  .refine(
    (items) => {
      if (items.length === 1) return true
      const portions = items.map((i) => i.portion?.toLowerCase()).filter(Boolean)
      return portions.length === new Set(portions).size
    },
    {
      message: "Portions must be unique.",
    }
  )

export const menuFormSchema = z.object({
  dish: z.string().min(3, { message: "Name is required." }),
  category: z.string().trim().min(3, { message: "Category is required." }),
  description: z.string(),
  isVeg: z.preprocess((x) => x === "true" || x === true, z.boolean().optional()),
  type: z.enum([ItemType.FOOD, ItemType.BEVERAGE, ItemType.BAR]).optional(),
  PriceItemMap: PriceItemMap,
  addons: z.array(z.object({ id: z.string() })).optional(),
})
export type MenuFormValues = z.infer<typeof menuFormSchema> & {
  imgPath?: string
}

interface MenuItemFormProps {
  closeModal?: () => void
  itemData?: MenuFormValues & MenuItemI
  restaurantId: string
  restaurantSlug: string
}

export default function MenuItemForm({
  closeModal,
  itemData,
  restaurantId,
  restaurantSlug,
}: MenuItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const imageRef = useRef<File | string | null>(null)
  const [availableAddons, setAvailableAddons] = useState<{ label: string; value: string }[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      ...(itemData || {
        dish: "",
        PriceItemMap: [{ price: 0, portion: "" }],
        category: "",
        description: "",
        isVeg: true,
        type: ItemType.FOOD,
      }),
    },
  })

  useEffect(() => {
    const fetchAddons = async () => {
      const addons = await fetchRestaurantAddons(restaurantId)
      setAvailableAddons(
        addons.map((addon: { name: string; price: number; id: string }) => ({
          label: `${addon.name} - ₹${addon.price}`,
          value: addon.id,
        }))
      )
    }
    fetchAddons()
  }, [restaurantId])

  form.watch(["type", "PriceItemMap"])

  const onDeleteSubmit = async (itemData: MenuFormValues & MenuItemI) => {
    try {
      await deleteMenuItemHelper(itemData.id, itemData.categoryId)
      toast({ title: `Item Deleted successfully.` })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      console.log(error)
      toast({ variant: "destructive", title: `Error Deleting Item.` })
    }
  }

  const onSubmit = async (data: MenuFormValues) => {
    try {
      setIsSaving(true)
      const imgPath = await saveImage(data.dish)
      if (imgPath !== null) {
        data.imgPath = imgPath
      }

      if (itemData) {
        await updateMenuItemHelper(itemData, data)
      } else {
        await addMenuItemHelper(data, restaurantId)
      }

      toast({ title: `Item ${itemData ? "updated" : "created"} successfully.` })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${itemData ? "updating" : "creating"} Item.`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const saveImage = async (dishName: string) => {
    const image = imageRef.current
    if (!image) return null
    if (typeof image === "string") return image

    try {
      const uploadedPath = await uploadImage(
        image,
        `${Date.now().toString()}-${restaurantSlug}/${dishName}/${image.name}`
      )
      toast({ title: `Image uploaded successfully.` })
      return uploadedPath
    } catch (error) {
      console.error("Failed to upload image:", error)
      toast({
        variant: "destructive",
        title: `Error uploading image.`,
        description: `An unexpected error occurred. Please try again.`,
      })
      return null
    }
  }

  return (
    <Form {...form}>
      {isSaving && <CenterLoading />}

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dish Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter dish name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={`Add category (ex. ${
                    form.getValues().type === "FOOD"
                      ? "Main Course"
                      : form.getValues().type === "BEVERAGE"
                      ? "Mocktail"
                      : "Whiskey"
                  })`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === ItemType.FOOD && (
          <FormField
            control={form.control}
            name="isVeg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Vegetarian?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ItemType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="PriceItemMap"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Price and Portion</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price || ""}
                        onChange={(e) => {
                          const newValue = [...field.value]
                          newValue[index] = {
                            ...newValue[index],
                            price: e.target.value ? parseFloat(e.target.value) : 0,
                          }
                          field.onChange(newValue)
                        }}
                      />
                      <Input
                        type="text"
                        placeholder={
                          form.getValues().type === "FOOD"
                            ? "Enter portion (ex. Half, Full)"
                            : form.getValues().type === "BEVERAGE"
                            ? "Enter portion (10ml, 30ml, 60ml, etc.)"
                            : "Enter portion (30ml, 60ml, 90ml, etc.)"
                        }
                        value={item.portion || ""}
                        onChange={(e) => {
                          const newValue = [...field.value]
                          newValue[index] = {
                            ...newValue[index],
                            portion: e.target.value,
                          }
                          field.onChange(newValue)
                        }}
                      />
                      <Button
                        className="px-2.5"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newValue = field.value.filter((_, i) => i !== index)
                          field.onChange(newValue)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      field.onChange([...field.value, { price: 0, portion: "" }])
                    }}
                  >
                    <PlusIcon className="mr-2 size-4" />
                    Add Price/Portion
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Addons</FormLabel>
              <FormControl>
                <MultiSelect
                  options={availableAddons}
                  value={field.value?.map((addon) => addon.id) || []}
                  onValueChange={(newValues) => {
                    field.onChange(newValues.map((addon) => ({ id: addon })))
                  }}
                  className="sm:min-w-[510px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <UploadItemImage imageRef={imageRef} uploadItemImage={itemData?.imgPath || ""} />

        <div className="flex w-full justify-center gap-2 max-sm:mt-2 max-sm:flex-col-reverse sm:col-span-2">
          <Button className="min-w-48" type="button" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          {itemData && (
            <Button
              className="min-w-48"
              type="button"
              variant="destructive"
              onClick={() => onDeleteSubmit(itemData)}
            >
              Delete Item
            </Button>
          )}
          <Button className="min-w-48" type="submit">
            {form.formState.isSubmitting
              ? `${itemData ? "Updating" : "Adding"} Item...`
              : `${itemData ? "Update" : "Add"} Item`}
          </Button>
        </div>
      </form>
    </Form>
  )
}
