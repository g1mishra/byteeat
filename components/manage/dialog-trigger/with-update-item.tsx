"use client"

import React, { useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"
import { MenuItemI } from "@/services/menuService"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer"
import { ScrollArea } from "../../ui/scroll-area"
import { MenuFormValues } from "../MenuItemForm"
import MenuUpdateForm from "../update-menu-item"

export default function WithUpdateMenuDialog({
  children,
  itemData,
  restaurantSlug,
  restaurantId,
}: {
  children: React.ReactElement
  itemData: MenuFormValues & MenuItemI
  restaurantSlug: string
  restaurantId: string
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
          <DialogContent className="flex h-auto max-h-[95vh] w-full max-w-[95vw]  flex-col justify-center overflow-hidden border-none">
            <DialogHeader>
              <DialogTitle>Update Item</DialogTitle>
            </DialogHeader>
            <MenuUpdateForm
              itemData={itemData}
              closeModal={onCloseModal}
              restaurantSlug={restaurantSlug}
              restaurantId={restaurantId}
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
        <DrawerContent className="flex h-[80vh] flex-col" hideHandle showCloseIcon>
          <DrawerHeader className="border-b text-left text-xl font-bold">
            <DrawerTitle>Update Item</DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="grow overflow-y-auto p-4">
            <MenuUpdateForm
              itemData={itemData}
              closeModal={onCloseModal}
              restaurantSlug={restaurantSlug}
              restaurantId={restaurantId}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  )
}
