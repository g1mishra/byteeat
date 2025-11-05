"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { updateRestaurant } from "@/services/restaurantService"
import { useState } from "react"
import { ChromePicker } from "react-color"
import { useForm } from "react-hook-form"
import { z } from "zod"

const themeSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  fontFamily: z.enum(["inter", "poppins", "roboto"]),
  menuStyle: z.enum(["list", "compact"]),
  buttonStyle: z.enum(["rounded", "square", "pill"]),
})

export type ThemeFormValues = z.infer<typeof themeSchema>

const defaultTheme = {
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  backgroundColor: "#f5f5f5",
  fontFamily: "inter",
  menuStyle: "list",
  buttonStyle: "rounded",
} as const

export default function RestaurantTheme({ restaurant }: { restaurant: any }) {
  const [activeColor, setActiveColor] = useState<"primary" | "secondary" | "background" | null>(
    null
  )
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<ThemeFormValues>({
    defaultValues: restaurant.theme || defaultTheme,
  })

  const onSubmit = async (data: ThemeFormValues) => {
    try {
      await updateRestaurant(restaurant.id, { theme: data })
      toast({
        title: "Theme updated",
        description: "Your restaurant theme has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="colors">
              <TabsList>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 cursor-pointer rounded-md border"
                            style={{ backgroundColor: field.value }}
                            onClick={() => setActiveColor("primary")}
                          />
                          <span>{field.value}</span>
                        </div>
                      </FormControl>
                      {activeColor === "primary" && (
                        <div className="absolute z-10">
                          <div className="fixed inset-0" onClick={() => setActiveColor(null)} />
                          <ChromePicker
                            color={field.value}
                            onChange={(color) => field.onChange(color.hex)}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 cursor-pointer rounded-md border"
                            style={{ backgroundColor: field.value }}
                            onClick={() => setActiveColor("secondary")}
                          />
                          <span>{field.value}</span>
                        </div>
                      </FormControl>
                      {activeColor === "secondary" && (
                        <div className="absolute z-10">
                          <div className="fixed inset-0" onClick={() => setActiveColor(null)} />
                          <ChromePicker
                            color={field.value}
                            onChange={(color) => field.onChange(color.hex)}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 cursor-pointer rounded-md border"
                            style={{ backgroundColor: field.value }}
                            onClick={() => setActiveColor("background")}
                          />
                          <span>{field.value}</span>
                        </div>
                      </FormControl>
                      {activeColor === "background" && (
                        <div className="absolute z-10">
                          <div className="fixed inset-0" onClick={() => setActiveColor(null)} />
                          <ChromePicker
                            color={field.value}
                            onChange={(color) => field.onChange(color.hex)}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="inter" id="inter" />
                                <label
                                  htmlFor="inter"
                                  className="font-inter cursor-pointer text-lg"
                                >
                                  Inter
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="poppins" id="poppins" />
                                <label
                                  htmlFor="poppins"
                                  className="font-poppins cursor-pointer text-lg"
                                >
                                  Poppins
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="roboto" id="roboto" />
                                <label
                                  htmlFor="roboto"
                                  className="font-roboto cursor-pointer text-lg"
                                >
                                  Roboto
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <FormField
                  control={form.control}
                  name="menuStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu Layout</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="grid" id="grid" />
                                <label htmlFor="grid" className="cursor-pointer">
                                  Grid
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="list" id="list" />
                                <label htmlFor="list" className="cursor-pointer">
                                  List
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="compact" id="compact" />
                                <label htmlFor="compact" className="cursor-pointer">
                                  Compact
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Style</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rounded" id="rounded" />
                                <label htmlFor="rounded" className="cursor-pointer">
                                  Rounded
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="square" id="square" />
                                <label htmlFor="square" className="cursor-pointer">
                                  Square
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pill" id="pill" />
                                <label htmlFor="pill" className="cursor-pointer">
                                  Pill
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full">
              Save Theme
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Live Preview</h3>
        <div
          className="rounded-lg border p-4"
          style={
            {
              "--primary-color": form.watch("primaryColor"),
              "--secondary-color": form.watch("secondaryColor"),
              backgroundColor: form.watch("backgroundColor"),
              fontFamily: form.watch("fontFamily"),
            } as any
          }
        >
          <div className="mb-4">
            <h4 className="mb-2 text-xl font-bold" style={{ color: form.watch("primaryColor") }}>
              Sample Menu Item
            </h4>
            <p className="text-gray-600">A delicious description of this menu item</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">₹299</span>
            <Button
              className={`${
                form.watch("buttonStyle") === "pill"
                  ? "rounded-full"
                  : form.watch("buttonStyle") === "square"
                    ? "rounded-none"
                    : "rounded-md"
              }`}
              style={{
                backgroundColor: form.watch("primaryColor"),
                color: form.watch("secondaryColor"),
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
