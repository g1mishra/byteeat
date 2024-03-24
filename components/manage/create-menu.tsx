"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { MenuItemI, addMenu, updateMenu } from "@/services/menuService"
import { zodResolver } from "@hookform/resolvers/zod"
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

const menuFormSchema = z.object({
  dish: z.string().min(3, { message: "Name is required." }),
  price: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Price must be at least 1." })
  ),
  category: z.string().min(3, { message: "Category is required." }),
  description: z.string(),
  vegOrNonVeg: z.string().optional(),
  foodOrBar: z.string(),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuCreateFormProps {
  closeModal?: () => void
  restaurantId: number
  itemData?: MenuItemI
}

export default function MenuCreateForm({
  closeModal,
  restaurantId,
  itemData,
}: MenuCreateFormProps) {
  const router = useRouter()
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      dish: "",
      price: 0,
      category: "",
      description: "",
      vegOrNonVeg: "",
      foodOrBar: "",
      ...(itemData || {}),
    },
  })

  const onSubmit = async (data: MenuFormValues) => {
    try {
      console.log(data)
      if (itemData) {
        await updateMenu({ ...data, restaurantId, id: itemData.id })
      } else {
        // Create menu item
        await addMenu({ ...data, restaurantId })
      }
      toast({
        title: `Menu ${itemData ? "updated" : "created"} successfully.`,
      })
      router.refresh()
      form.reset({})
      closeModal?.()
    } catch (error) {
      toast({
        title: `Error ${itemData ? "updating" : "creating"} menu.`,
      })
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
          name="price"
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Food or Bar?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Food", "Bar"].map((forb) => (
                    <SelectItem value={forb} key={forb}>
                      {forb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues().foodOrBar == "Food" ? (
          <FormField
            control={form.control}
            name="vegOrNonVeg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veg or Non Veg?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Veg or Non Veg?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["Veg", "Non-Veg"].map((vnv) => (
                      <SelectItem value={vnv} key={vnv}>
                        {vnv}
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
                <Input {...field} placeholder={`Add category (ex. ${form.getValues().foodOrBar == "Food" ? 'Main Course' : 'Wine'})`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {form.formState.isSubmitting
            ? `${itemData ? "Updating" : "Creating"} Menu...`
            : `${itemData ? "Update" : "Create"} Menu`}
        </Button>
      </form>
    </Form>
  )
}

type WithCreateMenuDialogProps = {
  children: React.ReactElement
  restaurantId: number
  itemData?: MenuItemI
}

export function WithCreateMenuDialog({
  children,
  restaurantId,
  itemData,
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
            itemData={itemData}
            restaurantId={restaurantId}
            closeModal={onCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
