"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FetchRestaurantReturnType,
  addOrUpdateSocialLinks,
  updateRestaurant,
} from "@/services/restaurantService"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"

import "react-phone-input-2/lib/style.css"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import CenterLoading from "@/components/center-loading"
import LogoOrAvatar from "@/components/logo-or-avatar"
import state2city from "@/components/manage/utils/cities"
import uploadImage from "@/components/manage/utils/uploadImage"

const editRestaurantFormSchema = z.object({
  name: z.string().min(1, { message: "Restaurant name is required" }),
  logoUrl: z.string().url().optional().or(z.literal("")),
  tableSize: z.preprocess(
    (x) => Number(x),
    z.number().int().min(1, { message: "Table size must be at least 1." })
  ),
  address_string: z.string().optional(),
  city: z.string().default("Jalandhar"),
  state: z.string(),
  country: z.string().default("India"),
  slug: z.string(),
  SocialLinks: z.object({
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    whatsapp: z.string().optional(),
  }),
})

export type EditRestaurantFormValues = z.infer<
  typeof editRestaurantFormSchema
> & {
  id?: string
  imgPath?: string
}

export default function EditRestaurant({
  response,
}: {
  response: FetchRestaurantReturnType
}) {
  const form = useForm<EditRestaurantFormValues>({
    resolver: zodResolver(editRestaurantFormSchema),
    mode: "onChange",
    defaultValues: {
      name: response?.name,
      logoUrl: response?.logoUrl,
      tableSize: response?.tableSize,
      address_string: response?.address_string,
      city: response?.city,
      state: response?.state,
      country: response?.country,
      slug: response?.slug,
      SocialLinks: {
        instagram: response?.SocialLinks?.instagram || "",
        twitter: response?.SocialLinks?.twitter || "",
        facebook: response?.SocialLinks?.facebook || "",
        whatsapp: response?.SocialLinks?.whatsapp || "",
      },
    },
  })

  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: EditRestaurantFormValues) => {
    // Define the data to check for changes
    const generalData = {
      logoUrl: response?.logoUrl,
      tableSize: response?.tableSize,
      address_string: response?.address_string,
      city: response?.city,
      state: response?.state,
      country: response?.country,
    }

    const socialData = response?.SocialLinks || {}

    const hasGeneralChanges =
      JSON.stringify(data) !==
      JSON.stringify({
        ...generalData,
        SocialLinks: undefined,
      })

    const hasSocialChanges =
      JSON.stringify(data.SocialLinks) !== JSON.stringify(socialData)

    if (!hasGeneralChanges && !hasSocialChanges) {
      toast({ title: `No changes made.` })
      return
    }

    setLoading(true)

    try {
      if (hasGeneralChanges) {
        if (file) {
          const uploadedUrl = await uploadImage(
            file,
            `${response?.slug}/logo.png`
          )
          if (uploadedUrl) {
            data.logoUrl = uploadedUrl
          }
        }

        data["id"] = response?.id

        const dataWithOutSocialLinks = {
          ...data,
          SocialLinks: undefined,
        }

        if (!response?.id) {
          throw new Error("Restaurant ID is required")
        }

        await updateRestaurant(dataWithOutSocialLinks)
      }

      if (hasSocialChanges) {
        if (!response?.id) {
          throw new Error("Restaurant ID is required")
        }

        await addOrUpdateSocialLinks(
          response?.id as string,
          data.SocialLinks as any
        )
      }

      toast({ title: `Restaurant updated successfully.` })
      router.refresh()
      form.reset({})
    } catch (error) {
      toast({
        title: `Error while updating restaurant.`,
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative mx-auto flex flex-col py-4">
      {loading && <CenterLoading />}
      <div className="flex w-full justify-between">
        <div className="relative max-w-max rounded border p-1">
          <LogoOrAvatar
            name={response?.name || ""}
            src={form.watch("logoUrl") || response?.logoUrl}
            className="size-32 object-contain"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0])
                form.setValue("logoUrl", URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
          <div className="absolute right-1 top-1 cursor-pointer rounded-full border bg-white p-1">
            <Pencil size={16} />
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Error while submitting form", errors)
          })}
          className="mt-6 grid gap-6 pb-16 sm:grid-cols-2" // Added padding-bottom
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter restaurant name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input {...field} disabled className="bg-gray-100" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The slug cannot be edited as it is used in URLs.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Input {...field} placeholder="Enter address" />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <FormField
            control={form.control}
            name="SocialLinks.instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Instagram URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SocialLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Twitter URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SocialLinks.facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Facebook URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SocialLinks.whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Whatsapp phone number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Whatsapp phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center border-t bg-white p-4">
        <Button
          type="submit"
          className="mx-auto w-full max-w-52"
          onClick={form.handleSubmit(onSubmit, (errors) => {
            console.log("Error while submitting form", errors)
          })}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
