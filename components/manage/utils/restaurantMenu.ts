import { MenuItemI } from "@/services/menuService";


// Shared utilities
export const prepareMenuItemForUpdate = async (
  editedItem: MenuItemI & { categoryName: string; newImage?: File },
  originalItem: MenuItemI,
  restaurantSlug: string
): Promise<{
  hasChanges: boolean;
  preparedData: Partial<MenuItemI & { categoryName: string }>;
}> => {
  let hasChanges = false
  const preparedData: Partial<MenuItemI & { categoryName: string }> = {
    id: editedItem.id
  }

  // Check basic fields for changes
  const fieldsToCheck = ['dish', 'description', 'categoryId', 'isVeg', 'type'] as const
  fieldsToCheck.forEach((field) => {
    if (editedItem[field] !== originalItem[field]) {
      hasChanges = true
      preparedData[field as keyof typeof preparedData] = editedItem[field] as any
    }
  })

  // Handle image upload if there's a new image
  if (editedItem.newImage) {
    hasChanges = true
    // Handle image upload logic here
    // preparedData.imgPath = await uploadImage(...)
  }

  // Always include complete price data in update
  const editedPrices = editedItem.PriceItemMap || []
  const originalPrices = originalItem.PriceItemMap || []

  if (JSON.stringify(editedPrices) !== JSON.stringify(originalPrices)) {
    hasChanges = true
    // Ensure all price items are properly formatted
    preparedData.PriceItemMap = editedPrices.map(price => ({
      itemId: editedItem.id,
      portion: price.portion || '',
      price: typeof price.price === 'string' ? parseFloat(price.price) : price.price
    }))
  }

  return { hasChanges, preparedData }
}

export const updateLocalMenuItems = (
  prevItems: MenuItemI[],
  updatedItems: Partial<MenuItemI>[],
  editingRows: Record<string, MenuItemI & { categoryName: string; newImage?: File }>
): MenuItemI[] => {
  return prevItems.map(item => {
    const updatedItem = updatedItems.find(update => update.id === item.id)
    if (!updatedItem) return item

    const editedRow = editingRows[item.id]
    
    return {
      ...item,
      ...updatedItem,
      // Ensure PriceItemMap is completely replaced with new data
      PriceItemMap: editedRow?.PriceItemMap || updatedItem.PriceItemMap || item.PriceItemMap
    }
  })
}
