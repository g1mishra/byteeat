"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { addMenuItemHelper } from "@/services/helper.service"
import { MenuItemI, addMenuItem, updateMenuItem } from "@/services/menuService"
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
import { toast } from "@/components/ui/use-toast"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export const menuFormSchema = z.object({
  dish: z.string().min(3, { message: "Name is required." }),
  category: z.string().min(3, { message: "Category is required." }),
  description: z.string(),
  isVeg: z.preprocess(
    (x) => x === "true" || x === true,
    z.boolean().optional()
  ),
  foodOrBar: z.preprocess((x) => x === "true" || x === true, z.boolean()),
  priceMap: z
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
export type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuCreateFormProps {
  closeModal?: () => void
  restaurantId: string
}

export default function MenuCreateForm({
  closeModal,
  restaurantId,
}: MenuCreateFormProps) {
  const router = useRouter()
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      dish: "",
      priceMap: [
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

  form.watch(["foodOrBar", "priceMap"])

  const errors = form.formState.errors

  const onSubmit = async (data: MenuFormValues) => {
    try {
      await addMenuItemHelper(data, restaurantId)
      toast({
        title: `Menu created successfully.`,
      })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      toast({
        title: `Error creating menu.`,
      })
      console.error(error)
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

        {form.getValues().priceMap.map((price, idx) => (
          <div key={idx} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name={`priceMap.${idx}.portion`}
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
              name={`priceMap.${idx}.price`}
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

            {idx === form.getValues().priceMap.length - 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    form.setValue("priceMap", [
                      ...form.getValues().priceMap,
                      { portion: "", price: 0 },
                    ])
                  }
                >
                  <PlusIcon size={22} />
                </Button>
                <FormMessage className="absolute bottom-[-22px]">
                  {errors.priceMap && (
                    <p role="alert">{errors.priceMap?.root?.message}</p>
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
                    "priceMap",
                    form.getValues().priceMap.filter((_, i) => i !== idx)
                  )
                }}
              >
                <Trash2 size={22} />
              </Button>
            )}
          </div>
        ))}

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
}

export function WithCreateMenuDialog({
  children,
  restaurantId,
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Menu</DialogTitle>
          </DialogHeader>
          <MenuCreateForm
            restaurantId={restaurantId}
            closeModal={onCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
