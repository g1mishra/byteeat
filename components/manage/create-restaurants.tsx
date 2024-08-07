"use client"

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
import { useToast } from "@/components/ui/use-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import state2city from "./utils/cities"

const restaurantFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  tableSize: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Table size must be at least 1." })
  ),
  address_string: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
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
  const { toast } = useToast()
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    mode: "onChange",
  })
  const session = useSession()
  const sessionData = session.data as any
  const router = useRouter()

  form.watch("state")

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      if (!sessionData?.user?.id) throw new Error("User not found")
      await addRestaurant(
        data,
        sessionData.user.id
      )
      toast({
        title: "Restaurant created successfully.",
      })
      router.refresh()
      closeModal?.()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error creating restaurant.",
      })
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
            <FormItem className="sm:col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter restaurant address" />
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
              <Select
                disabled={!form.getValues().state}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select city"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(form.getValues().state
                    ? state2city[form.getValues().state]
                    : null
                  )?.map((city: any) => (
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

        <div className="mt-2 flex w-full justify-center gap-2 max-sm:flex-col-reverse sm:col-span-2">
          <Button
            className="min-w-48"
            type="button"
            variant="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button type="submit" className="min-w-48">
            {form.formState.isSubmitting ? "Creating..." : "Create Restaurant"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
