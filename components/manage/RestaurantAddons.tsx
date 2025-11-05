"use client"

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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  addRestaurantAddon,
  deleteRestaurantAddon,
  fetchRestaurantAddons,
  updateRestaurantAddon,
} from "@/services/menuService"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, PlusCircle, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const addonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
})

type AddonFormValues = z.infer<typeof addonSchema>
export default function RestaurantAddons({ restaurantId }: { restaurantId: string }) {
  const [addons, setAddons] = useState<any[]>([])
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null)

  const form = useForm<AddonFormValues>({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  })

  useEffect(() => {
    fetchAddons()
  }, [])

  const fetchAddons = async () => {
    const fetchedAddons = await fetchRestaurantAddons(restaurantId)
    setAddons(fetchedAddons)
  }

  const onSubmit = async (data: AddonFormValues) => {
    const submissionData = {
      ...data,
      price: Number(data.price), // Ensure price is a number
    }

    if (editingAddonId) {
      await updateRestaurantAddon({ id: editingAddonId, ...submissionData })
    } else {
      await addRestaurantAddon({ ...submissionData, restaurantId })
    }
    form.reset()
    setEditingAddonId(null)
    fetchAddons()
  }

  const handleEdit = (addon: any) => {
    form.setValue("name", addon.name)
    form.setValue("price", addon.price)
    setEditingAddonId(addon.id)
  }

  const handleDelete = async (addonId: string) => {
    await deleteRestaurantAddon(addonId)
    fetchAddons()
  }

  return (
    <div className="container mx-auto py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Addon Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter addon name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" placeholder="Enter price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            {editingAddonId ? (
              <>
                <Edit className="mr-2 size-4" /> Update Addon
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 size-4" /> Add Addon
              </>
            )}
          </Button>
        </form>
      </Form>

      <Separator className="my-6" />

      <h3 className="mb-4 text-xl font-semibold">Existing Addons</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addons.map((addon) => (
            <TableRow key={addon.id}>
              <TableCell>{addon.name}</TableCell>
              <TableCell>₹{addon.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => handleEdit(addon)}
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  <Edit className="size-4" />
                </Button>
                <Button onClick={() => handleDelete(addon.id)} variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
