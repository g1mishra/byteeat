"use client"

import React, { useState } from "react"
import useMediaQuery from "@/hook/useMediaQuery"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../ui/drawer"
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
          <DialogContent className="flex h-auto max-h-[95vh] w-full max-w-[95vw]  flex-col justify-center overflow-hidden border-none">
            <DialogHeader>
              <DialogTitle>Create Restaurant</DialogTitle>
            </DialogHeader>
            <RestaurantCreateForm closeModal={onCloseModal} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="flex h-[80vh] flex-col" hideHandle showCloseIcon>
            <DrawerHeader className="border-b text-left text-xl font-bold">
              <DrawerTitle>Create Restaurant</DrawerTitle>
            </DrawerHeader>
            <div className="grow overflow-y-auto p-4">
              <RestaurantCreateForm closeModal={onCloseModal} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
