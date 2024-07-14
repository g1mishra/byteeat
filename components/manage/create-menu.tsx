"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { addMenuItemHelper } from "@/services/helper.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import UploadItemImage from "./upload-item-image"
import uploadImage from "./utils/uploadImage"

export const menuFormSchema = z.object({
  dish: z.string().min(3, { message: "Name is required." }),
  category: z.string().min(3, { message: "Category is required." }),
  description: z.string(),
  isVeg: z.preprocess(
    (x) => x === "true" || x === true,
    z.boolean().optional()
  ),
  foodOrBar: z.preprocess((x) => x === "true" || x === true, z.boolean()),
  PriceItemMap: z
    .array(
      z.object({
        price: z.preprocess(
          (x) => Number(x),
          z.number().int().min(1, { message: "Price must be at least 1." })
        ),
        portion: z.string(),
        id: z.string().optional(),
        itemId: z.string().optional(),
      })
    )
    .refine(
      (items) => {
        const portions = items.map((i) => i.portion)
        return new Set(portions).size === items.length
      },
      {
        message: "Portions must be unique.",
      }
    ),
})
export type MenuFormValues = z.infer<typeof menuFormSchema> & {
  imgPath?: string
}

interface MenuCreateFormProps {
  closeModal?: () => void
  restaurantId: string
  slug: string
}

export default function MenuCreateForm({
  closeModal,
  restaurantId,
  slug,
}: MenuCreateFormProps) {
  const imagesRef = useRef<(File | string)[]>([])
  const router = useRouter()
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      dish: "",
      PriceItemMap: [
        {
          price: 0,
          portion: "",
        },
      ],
      category: "",
      description: "",
      isVeg: true,
      foodOrBar: true,
    },
  })

  form.watch(["foodOrBar", "PriceItemMap"])
  const { toast } = useToast()
  const errors = form.formState.errors
  const onSubmit = async (data: MenuFormValues) => {
    try {
      const imgPath = await saveImages(data.dish)
      if (imgPath) {
        data.imgPath = imgPath
      }
      await addMenuItemHelper(data, restaurantId)
      toast({
        title: `Menu created successfully.`,
      })

      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error creating menu.`,
      })
      console.error(error)
    }
  }

  const saveImages = async (dishName: string) => {
    const images = imagesRef.current
    if (!images || images.length === 0) return null

    const files = images.filter((i) => i instanceof File) as File[]
    if (files.length === 0) return null

    const uploadPromises = files.map((file) =>
      uploadImage(
        file,
        `${Date.now().toString()}-${slug}/${dishName}/${file.name}`
      )
        .then((result) => ({ success: true, result }))
        .catch((error) => ({ success: false, error: error.message }))
    )

    const uploadedImages = await Promise.all(uploadPromises)

    const successUploads = uploadedImages
      .filter((res) => res.success)
      .map((res) => (res as { success: true; result: string }).result)

    const failedUploads = uploadedImages
      .filter((res) => !res.success)
      .map((res) => (res as { success: false; error: string }).error)

    if (successUploads.length === 0) {
      toast({
        variant: "destructive",
        title: `Error uploading images.`,
        description: failedUploads.join(";"),
      })
      return null
    } else if (failedUploads.length > 0) {
      toast({
        variant: "destructive",
        title: `Some images failed to upload.`,
        description: failedUploads.join(";"),
      })
      return successUploads.join(";")
    } else {
      toast({
        title: `Images uploaded successfully.`,
      })
      return successUploads.join(";")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  onValueChange={(value) =>
                    field.onChange(value === "true" ? true : false)
                  }
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
          // disabled={itemData ? true : false}
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
          <div key={idx} className="flex items-end gap-4">
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
                          ? "Half, Full"
                          : "10ml, 30ml, 60ml, etc."
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
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {idx === form.getValues().PriceItemMap.length - 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    form.setValue("PriceItemMap", [
                      ...form.getValues().PriceItemMap,
                      { portion: "", price: 0 },
                    ])
                  }
                >
                  <PlusIcon size={22} />
                </Button>
                <FormMessage className="absolute bottom-[-22px]">
                  {errors.PriceItemMap && (
                    <p role="alert">{errors.PriceItemMap?.root?.message}</p>
                  )}
                </FormMessage>
              </>
            ) : (
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
            )}
          </div>
        ))}
        <UploadItemImage imagesRef={imagesRef} uploadItemImage={""} />
        <Button type="submit">
          {form.formState.isSubmitting ? "Creating Menu..." : "Create Menu"}
        </Button>
      </form>
    </Form>
  )
}

type WithCreateMenuDialogProps = {
  children: React.ReactElement
  restaurantId: string
  slug: string
}

export function WithCreateMenuDialog({
  children,
  restaurantId,
  slug,
}: WithCreateMenuDialogProps): React.ReactElement {
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
            <DialogTitle>Create Menu</DialogTitle>
          </DialogHeader>
          <MenuCreateForm
            restaurantId={restaurantId}
            slug={slug}
            closeModal={onCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
