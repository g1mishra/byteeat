"use client"

import React, { useState } from "react"
import { addRestaurant } from "@/services/restaurantService"
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

const restaurantFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  tableSize: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Table size must be at least 1." })
  ),
  address: z.string().min(1, { message: "Address is required." }),
})

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>

interface RestaurantCreateFormProps {
  closeModal?: () => void
}

export default function RestaurantCreateForm({
  closeModal,
}: RestaurantCreateFormProps) {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      console.log(data)
      const resp = await addRestaurant(data)
      console.log(resp)
      toast({
        title: "Restaurant created successfully.",
      })
      form.reset({
        name: "",
        tableSize: 0,
        address: "",
      })
      closeModal?.()
    } catch (error) {
      console.error(error)
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter restaurant name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tableSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Size</FormLabel>
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter restaurant address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {form.formState.isSubmitting ? "Creating..." : "Create Restaurant"}
        </Button>
      </form>
    </Form>
  )
}

type WithCreateRestaurantDialogProps = {
  children: React.ReactElement
}

export function WithCreateRestaurantDialog({
  children,
}: WithCreateRestaurantDialogProps): React.ReactElement {
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
            <DialogTitle>Create Restaurant</DialogTitle>
          </DialogHeader>
          <RestaurantCreateForm closeModal={onCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
