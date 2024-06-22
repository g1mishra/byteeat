"use client"

import React, { use, useState } from "react"
import { useRouter } from "next/navigation"
import { addRestaurant } from "@/services/restaurantService"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
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
import state2city from "./utils/cities"

const restaurantFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  tableSize: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Table size must be at least 1." })
  ),
  // address: z.string().min(1, { message: "Address is required." }),
  address_string: z
    .string()
    .min(1, { message: "Ex. 123 Main Street, Anytown" }),
  city: z.string().default("Jalandhar"),
  state: z.string(),
  country: z.string().default("India"),
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
  const session = useSession()
  const sessionData = session.data as any
  const router = useRouter()

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      if (!sessionData?.user?.userId) throw new Error("User not found")
      const resp = await addRestaurant({
        ...data,
        userId: sessionData?.user?.userId,
      })
      toast({
        title: "Restaurant created successfully.",
      })
      router.refresh()
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
          name="address_string"
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
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={(value) => field.onChange(value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Find your state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(state2city).map((state: any) => (
                    <SelectItem value={String(state)} key={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={(value) => field.onChange(value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select city"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(form.getValues().state != undefined
                    ? state2city[form.getValues().state]
                    : state2city["Punjab"]
                  ).map((city: any) => (
                    <SelectItem value={String(city)} key={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
