"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  deleteMenuItemHelper,
  updateMenuItemHelper,
} from "@/services/helper.service"
import { MenuItemI, fetchRestaurantAddons } from "@/services/menuService"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"

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
import { useToast } from "@/components/ui/use-toast"

import { MultiSelect } from "../ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { MenuFormValues, menuFormSchema } from "./create-menu-item"
import UploadItemImage from "./upload-item-image"
import uploadImage from "./utils/uploadImage"

interface MenuUpdateFormProps {
  closeModal?: () => void
  itemData: MenuFormValues & MenuItemI
  restaurantSlug: string
}

export default function MenuUpdateForm({
  closeModal,
  itemData,
  restaurantSlug,
}: MenuUpdateFormProps) {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const imagesRef = useRef<(File | string)[]>([])
  const [availableAddons, setAvailableAddons] = useState<
    { label: string; value: string }[]
  >([])

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      ...(itemData || {}),
    },
  })

  useEffect(() => {
    const fetchAddons = async () => {
      const addons = await fetchRestaurantAddons(params.restaurantId as string)
      setAvailableAddons(
        addons.map((addon: { name: string; price: number; id: string }) => ({
          label: `${addon.name} - ₹${addon.price}`,
          value: addon.id,
        }))
      )
    }
    fetchAddons()
  }, [params.restaurantId])

  const errors = form.formState.errors

  form.watch(["type", "PriceItemMap"])

  const onDeleteSubmit = async (itemData: MenuFormValues & MenuItemI) => {
    try {
      await deleteMenuItemHelper(itemData.id, itemData.categoryId)
      toast({
        title: `Item Deleted successfully.`,
      })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: `Error Deleting Item.`,
      })
    }
  }

  const onSubmit = async (data: MenuFormValues) => {
    try {
      const imgPath = await saveImages(data.dish)
      if (imgPath !== null) {
        itemData.imgPath = imgPath
      }

      await updateMenuItemHelper(itemData, data)

      toast({
        title: `Item ${itemData ? "updated" : "created"} successfully.`,
      })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${itemData ? "updating" : "creating"} Item.`,
      })
    }
  }

  const saveImages = async (dishName: string) => {
    const images = imagesRef.current
    if (images.length === 0) return images.join(";")
    const files = images.filter((i) => i instanceof File)
    if (files.length === 0) return images.join(";")

    const alreadyUploadedImages = images.filter((i) => typeof i === "string")

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          try {
            if (typeof file !== "string") {
              const uploadedPath = await uploadImage(
                file as File,
                `${Date.now().toString()}-${restaurantSlug}/${dishName}/${
                  file.name
                }`,
                true
              )
              return { success: true, file, uploadedPath }
            }
          } catch (error) {
            if (error instanceof Error) {
              return { success: false, file, message: error.message }
            }
            return {
              success: false,
              file,
              message: "An unexpected error occurred.",
            }
          }
        })
      )

      // Separate successful uploads from failed uploads
      const successUploads = uploadedImages.filter((result) => result?.success)
      const failedUploads = uploadedImages.filter((result) => !result?.success)

      if (successUploads.length === 0) {
        toast({
          variant: "destructive",
          title: `Error uploading images.`,
          description: `All images failed to upload.`,
        })
        return null
      } else if (failedUploads.length > 0) {
        toast({
          variant: "destructive",
          title: `Error uploading some images:`,
          description: failedUploads
            .map((result) => `${result?.file.name}: ${result?.message}`)
            .join(";"),
        })
        return [
          ...alreadyUploadedImages,
          ...successUploads.map((result) => result?.uploadedPath),
        ].join(";")
      } else {
        toast({
          title: `All images uploaded successfully.`,
        })
        return [
          ...alreadyUploadedImages,
          ...successUploads.map((result) => result?.uploadedPath),
        ].join(";")
      }
    } catch (error) {
      console.error("Failed to upload images:", error)
      toast({
        variant: "destructive",
        title: `Error uploading images.`,
        description: `An unexpected error occurred. Please try again.`,
      })
      return null
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Error while submitting form", errors)
        })}
        className="grid gap-4 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="dish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dish Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter dish name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🍔 or 🍺?</FormLabel>
              <Select
                defaultValue={String(field.value)}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Food or Bar?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    {
                      value: "FOOD",
                      label: "Food",
                    },
                    {
                      value: "BEVERAGE",
                      label: "Bevarage",
                    },
                    {
                      value: "BAR",
                      label: "Bar",
                    },
                  ].map((item) => (
                    <SelectItem value={String(item.value)} key={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues().type === "FOOD" ? (
          <FormField
            control={form.control}
            name="isVeg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veg or Non Veg?</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "true" ? true : false)
                  }}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Veg or Non Veg?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      {
                        value: true,
                        label: "Veg",
                      },
                      {
                        value: false,
                        label: "Non Veg",
                      },
                    ].map((item) => (
                      <SelectItem value={String(item.value)} key={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add category</FormLabel>
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
              <FormLabel>Add description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Add description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues().PriceItemMap.map((price, idx) => (
          <div
            key={idx}
            className="relative flex items-start gap-4 sm:col-span-2"
          >
            <FormField
              control={form.control}
              name={`PriceItemMap.${idx}.portion`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Portion</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      placeholder={
                        form.getValues().type === "FOOD"
                          ? "Enter portion (ex. Half, Full)"
                          : form.getValues().type === "BEVERAGE"
                          ? "Enter portion (10ml, 30ml, 60ml, etc.)"
                          : "Enter portion (30ml, 60ml, 90ml, etc.)"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`PriceItemMap.${idx}.price`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "flex min-w-24 shrink-0 items-center gap-4 self-end",
                {
                  "self-center":
                    errors.PriceItemMap?.[idx]?.portion ||
                    errors.PriceItemMap?.[idx]?.price,
                }
              )}
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  form.setValue(
                    "PriceItemMap",
                    form.getValues().PriceItemMap.filter((_, i) => i !== idx)
                  )
                }}
              >
                <Trash2 size={22} />
              </Button>

              {idx === form.getValues().PriceItemMap.length - 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    form.setValue("PriceItemMap", [
                      ...form.getValues().PriceItemMap,
                      { portion: "", price: 0, itemId: itemData.id },
                    ])
                  }
                >
                  <PlusIcon size={22} />
                </Button>
              ) : null}
            </div>
          </div>
        ))}

        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Addons</FormLabel>
              <FormControl>
                <MultiSelect
                  options={availableAddons}
                  onValueChange={(selectedOptions) => {
                    field.onChange(
                      selectedOptions.map((addon) => ({ id: addon }))
                    )
                  }}
                  value={field?.value?.map((addon) => addon.id) ?? []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <UploadItemImage
          imagesRef={imagesRef}
          uploadItemImage={itemData?.imgPath?.trim() || ""}
        />

        <div className="flex w-full justify-center gap-2 max-sm:mt-2 max-sm:flex-col-reverse sm:col-span-2">
          <Button
            className="min-w-48"
            type="button"
            variant="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="min-w-48"
            type="button"
            variant="destructive"
            onClick={() => {
              onDeleteSubmit(itemData)
            }}
          >
            Delete Item
          </Button>
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
