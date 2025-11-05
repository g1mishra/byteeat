"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { ScrollArea } from "@/components/ui/scroll-area"
import useMediaQuery from "@/hook/useMediaQuery"
import { validateJoiningKey } from "@/services/waiter.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { cloneElement, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function WithJoinRestaurantDialog({
  children,
}: {
  children: React.ReactElement
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)

  const cloneChildren = cloneElement(children, {
    onClick: openDialog,
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <>
      {cloneChildren}{" "}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            data-radix-scroll-area-viewport=""
            className="max-h-[90vh] w-96 overflow-y-auto sm:max-w-screen-lg"
          >
            <DialogHeader>
              <DialogTitle>Enter Joining Key</DialogTitle>
              <DialogDescription>
                Please enter 6-digit key provided by your restaurant.
              </DialogDescription>
            </DialogHeader>
            <JoinRestaurant closeModal={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DialogHeader className="px-8 pt-4">
              <DialogTitle>Enter Joining Key</DialogTitle>
              <DialogDescription>
                Please enter the 6-digit provided by your restaurant.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[90vh] w-full overflow-y-auto p-4">
              <JoinRestaurant closeModal={() => setIsOpen(false)} />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

const FormSchema = z.object({
  key: z.string().min(6, {
    message: "Your joining key must be 6 characters.",
  }),
})

function JoinRestaurant({ closeModal }: { closeModal: () => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      key: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await validateJoiningKey(data.key)
    closeModal()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-6 px-4 md:px-0"
      >
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="min-w-48" type="submit">
          {form.formState.isSubmitting ? "Joining..." : "Join"}
        </Button>
      </form>
    </Form>
  )
}
