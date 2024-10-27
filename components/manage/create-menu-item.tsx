import MenuItemForm from "./MenuItemForm"

interface MenuCreateFormProps {
  closeModal?: () => void
  restaurantId: string
  restaurantSlug: string
}

export default function MenuCreateForm({
  closeModal,
  restaurantId,
  restaurantSlug,
}: MenuCreateFormProps) {
  return (
    <MenuItemForm
      closeModal={closeModal}
      restaurantId={restaurantId}
      restaurantSlug={restaurantSlug}
    />
  )
}
