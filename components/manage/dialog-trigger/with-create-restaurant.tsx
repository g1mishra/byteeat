"use client"

import React, { useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer"
import { ScrollArea } from "../../ui/scroll-area"
import RestaurantCreateForm from "../create-restaurants"

export default function WithCreateRestaurantDialog({
  children,
}: {
  children: React.ReactElement
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)
  const onCloseModal = () => setIsOpen(false)

  const cloneChildren = React.cloneElement(children, {
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
            className="max-h-[90vh] w-[90%] overflow-y-auto sm:max-w-screen-lg"
          >
            <DialogHeader>
              <DialogTitle>Create Restaurant</DialogTitle>
            </DialogHeader>
            <RestaurantCreateForm closeModal={onCloseModal} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create Restaurant</DrawerTitle>
            </DrawerHeader>
            <ScrollArea>
              <RestaurantCreateForm closeModal={onCloseModal} />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
