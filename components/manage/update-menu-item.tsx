"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  deleteMenuItemHelper,
  updateMenuItemHelper,
} from "@/services/helper.service"
import { MenuItemI } from "@/services/menuService"
import { getRestaurantSlug } from "@/services/restaurantService"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useToast } from "@/components/ui/use-toast"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { menuFormSchema } from "./create-menu-item"
import UploadItemImage from "./upload-item-image"
import uploadImage from "./utils/uploadImage"

export type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuUpdateFormProps {
  closeModal?: () => void
  itemData: MenuFormValues & MenuItemI
}

export default function MenuUpdateForm({
  closeModal,
  itemData,
}: MenuUpdateFormProps) {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const imagesRef = useRef<(File | string)[]>([])
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      ...(itemData || {}),
    },
  })

  const errors = form.formState.errors

  form.watch(["foodOrBar", "PriceItemMap"])

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

    let slug = "common"

    try {
      const slugRes = await getRestaurantSlug(params.restroId as string)
      if (slugRes) {
        slug = slugRes.slug
      }
    } catch (error) {
      console.error("Failed to get restaurant slug:", error)
    }

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          try {
            if (typeof file !== "string") {
              const uploadedPath = await uploadImage(
                file as File,
                `${Date.now().toString()}-${slug}/${dishName}/${file.name}`
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
        className="space-y-8"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Add description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="foodOrBar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🍔 or 🍺?</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "true" ? true : false)
                }
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Food or Bar?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    {
                      value: true,
                      label: "Food",
                    },
                    {
                      value: false,
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

        {form.getValues().foodOrBar ? (
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
                    form.getValues().foodOrBar ? "Main Course" : "Wine"
                  })`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues().PriceItemMap.map((price, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            <FormField
              control={form.control}
              name={`PriceItemMap.${idx}.portion`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portion</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      placeholder={
                        form.getValues().foodOrBar
                          ? "Enter portion (ex. Half, Full)"
                          : "Enter portion (10ml, 30ml, 60ml, etc.)"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`PriceItemMap.${idx}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="self-end"
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
                className="self-end"
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
        ))}

        <UploadItemImage
          imagesRef={imagesRef}
          uploadItemImage={itemData?.imgPath?.trim() || ""}
        />

        <div className="flex w-full justify-center space-x-2">
          <Button type="submit">
            {form.formState.isSubmitting
              ? `${itemData ? "Updating" : "Adding"} Item...`
              : `${itemData ? "Update" : "Add"} Item`}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onDeleteSubmit(itemData)
            }}
          >
            Delete Item
          </Button>
        </div>
      </form>
    </Form>
  )
}

type WithUpdateMenuDialogProps = {
  children: React.ReactElement
  itemData: MenuFormValues & MenuItemI
}

export function WithUpdateMenuDialog({
  children,
  itemData,
}: WithUpdateMenuDialogProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)
  const onCloseModal = () => setIsOpen(false)
  const cloneChildren = React.cloneElement(children, {
    onClick: openDialog,
  })

  return (
    <>
      {cloneChildren}
      <Dialog open={isOpen} onOpenChange={onCloseModal} modal>
        <DialogContent
          data-radix-scroll-area-viewport=""
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Update Item</DialogTitle>
          </DialogHeader>
          <MenuUpdateForm itemData={itemData} closeModal={onCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
