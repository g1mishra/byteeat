"use client"

import React, { useState } from "react"
import { addMenu } from "@/services/menuService"
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
  restaurant: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Restaurant is required." })
  ),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuCreateFormProps {
  closeModal?: () => void
}

export default function MenuCreateForm({ closeModal }: MenuCreateFormProps) {
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: MenuFormValues) => {
    try {
      console.log(data)
      await addMenu(data)
      toast({
        title: "Menu created successfully.",
      })
      form.reset({
        dish: "",
        price: 0,
        category: "",
        restaurant: 0,
      })
      closeModal?.()
    } catch (error) {
      toast({
        title: "Error creating restaurant.",
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
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter max table size"
                />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sabzi">Sabzi</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="drink">Drink</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restaurant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Restaurant 1</SelectItem>
                  <SelectItem value="2">Restaurant 2</SelectItem>
                  <SelectItem value="3">Restaurant 3</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {form.formState.isSubmitting ? "Creating..." : "Create Menu"}
        </Button>
      </form>
    </Form>
  )
}

type WithCreateMenuDialogProps = {
  children: React.ReactElement
}

export function WithCreateMenuDialog({
  children,
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
          <MenuCreateForm closeModal={onCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
