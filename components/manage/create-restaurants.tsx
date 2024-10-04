"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { addRestaurant, getRestaurantIdBySlug } from "@/services/restaurantService"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { debounce } from "@/lib/utils"
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

import CenterLoading from "../center-loading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import state2city from "./utils/cities"
import uploadImage from "./utils/uploadImage"

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
  slug: z
    .string()
    .min(1, { message: "Slug is required." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
})

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>

interface RestaurantCreateFormProps {
  closeModal?: () => void
}

export default function RestaurantCreateForm({ closeModal }: RestaurantCreateFormProps) {
  const { toast } = useToast()
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    mode: "onChange",
  })
  const session = useSession()
  const sessionData = session.data as any
  const router = useRouter()

  const [isSaving, setIsSaving] = useState(false)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  form.watch("state")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return
    setIsCheckingSlug(true)
    try {
      const isAvailable = await getRestaurantIdBySlug(slug)
      setSlugAvailable(!isAvailable)
    } catch (error) {
      console.error("Error checking slug availability:", error)
      setSlugAvailable(null)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  const debouncedCheck = debounce((value: string) => {
    checkSlugAvailability(value)
  }, 500)

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      setIsSaving(true)
      if (!sessionData?.user?.id) throw new Error("User not found")

      let logoUrl = ""
      if (file) {
        logoUrl = await uploadImage(
          file,
          `${Date.now().toString()}-${data.slug}/logo/${file.name}`,
          true
        )
      }

      await addRestaurant(
        {
          ...data,
          address_string: data.address_string || "",
          logoUrl,
        },
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
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <React.Fragment>
      {isSaving && <CenterLoading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Error while submitting form", errors)
          })}
          className="flex h-full flex-col"
        >
          <div className="grid max-h-max grow gap-6 overflow-y-auto pb-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-4">
                <div className="relative size-32 overflow-hidden rounded-lg border">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Logo preview" fill className="object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gray-100 text-gray-400">
                      No logo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0])
                        setPreviewUrl(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                  <div className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-md">
                    <Pencil size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Restaurant Logo</h3>
                  <p className="text-sm text-gray-500">Upload your restaurant logo</p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter restaurant name"
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      onBlur={(e) => {
                        const generatedSlug = generateSlug(e.target.value)
                        form.setValue("slug", generatedSlug)
                        debouncedCheck(generatedSlug)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Enter restaurant slug"
                        onChange={(e) => {
                          field.onChange(e)
                          setSlugAvailable(null)
                          setIsCheckingSlug(true)
                          debouncedCheck(e.target.value)
                        }}
                      />
                      {isCheckingSlug && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className="loading loading-spinner loading-xs text-primary"></span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {slugAvailable === false && (
                    <p className="text-xs text-red-500">This URL is already taken.</p>
                  )}
                  {slugAvailable === true && (
                    <p className="text-xs text-green-500">This URL is available.</p>
                  )}
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
                    <Input type="number" {...field} placeholder="Enter max table size" />
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
                      {(form.getValues().state ? state2city[form.getValues().state] : null)?.map(
                        (city: any) => (
                          <SelectItem value={String(city)} key={city}>
                            {city}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
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
          </div>

          <div className="bg-background sticky bottom-0 mt-6 flex justify-center gap-2 border-t px-4 pt-4 sm:justify-end">
            <Button className="min-w-[120px]" type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-[120px]"
              disabled={!slugAvailable || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Restaurant"}
            </Button>
          </div>
        </form>
      </Form>
    </React.Fragment>
  )
}
