import { MenuItemI } from "@/services/menuService"

import MenuItemForm, { MenuFormValues } from "./MenuItemForm"

interface MenuUpdateFormProps {
  closeModal?: () => void
  itemData: MenuFormValues & MenuItemI
  restaurantId: string
  restaurantSlug: string
}

export default function MenuUpdateForm({
  closeModal,
  itemData,
  restaurantId,
  restaurantSlug,
}: MenuUpdateFormProps) {
  return (
    <MenuItemForm
      closeModal={closeModal}
      itemData={itemData}
      restaurantId={restaurantId}
      restaurantSlug={restaurantSlug}
    />
  )
}
