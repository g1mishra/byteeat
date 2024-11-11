"use client"

import React, { useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer"
import { ScrollArea } from "../../ui/scroll-area"
import MenuCreateForm from "../create-menu-item"

export default function WithCreateMenuDialog({
  children,
  restaurantId,
  restaurantSlug,
}: {
  children: React.ReactElement
  restaurantId: string
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
          <DialogContent className="flex h-auto max-h-[95vh] w-full max-w-[95vw]  flex-col justify-center overflow-y-auto border-none">
            <DialogHeader>
              <DialogTitle>Create Item</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[90vh]">
              <MenuCreateForm
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
                closeModal={onCloseModal}
              />
            </ScrollArea>
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
            <DrawerTitle>Create Item</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="grow overflow-y-auto p-4">
            <MenuCreateForm
              restaurantId={restaurantId}
              restaurantSlug={restaurantSlug}
              closeModal={onCloseModal}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  )
}
