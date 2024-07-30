"use client"

import React, { useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"
import { MenuItemI } from "@/services/menuService"

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
import { MenuFormValues } from "../create-menu-item"
import MenuUpdateForm from "../update-menu-item"

export default function WithUpdateMenuDialog({
  children,
  itemData,
  restaurantSlug,
}: {
  children: React.ReactElement
  itemData: MenuFormValues & MenuItemI
  restaurantSlug: string
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)
  const onCloseModal = () => setIsOpen(false)
  const cloneChildren = React.cloneElement(children, {
    onClick: openDialog,
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <>
        {cloneChildren}
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
          <DialogContent
            data-radix-scroll-area-viewport=""
            className="max-h-[90vh] w-[90%] overflow-y-auto sm:max-w-screen-lg"
          >
            <DialogHeader>
              <DialogTitle>Update Item</DialogTitle>
            </DialogHeader>
            <MenuUpdateForm
              itemData={itemData}
              closeModal={onCloseModal}
              restaurantSlug={restaurantSlug}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      {cloneChildren}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Update Item</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="max-h-[90vh] w-full overflow-y-auto p-4">
            <MenuUpdateForm
              itemData={itemData}
              closeModal={onCloseModal}
              restaurantSlug={restaurantSlug}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  )
}
