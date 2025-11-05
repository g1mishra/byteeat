"use client"

import CenterLoading from "@/components/center-loading"
import Loading from "@/components/loader"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MenuItemI, updateMenuItems } from "@/services/menuService"
import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import WithCreateMenuDialog from "../dialog-trigger/with-create-item"
import { prepareMenuItemForUpdate, updateLocalMenuItems } from "../utils/restaurantMenu"
import SearchBar from "./SearchBar"
import ViewToggle from "./ViewToggle"

// Types
interface RestaurantMenuProps {
  response: any
  restaurantId: string
  restaurantSlug: string
}

interface EditableMenuItem extends MenuItemI {
  categoryName: string
  newImage?: File
}

type EditingRowsType = Record<string, EditableMenuItem>

// Lazy-loaded components
const GridView = dynamic(() => import("./GridView"), {
  loading: () => <Loading />,
  ssr: false,
})

const TableView = dynamic(() => import("./TableView"), {
  loading: () => <Loading />,
  ssr: false,
})

// Helper functions
const extractMenuItems = (response: any): EditableMenuItem[] => {
  return (
    response?.ItemCategory?.flatMap((category: any) =>
      category.Item.map((item: MenuItemI) => ({
        ...item,
        categoryId: category.id,
      }))
    ) || []
  )
}

const extractCategories = (response: any): Record<string, string> => {
  return (
    response?.ItemCategory?.reduce((acc: Record<string, string>, category: any) => {
      acc[category.id] = category.categoryName
      return acc
    }, {}) || {}
  )
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  response,
  restaurantId,
  restaurantSlug,
}) => {
  const [view, setView] = useState<"grid" | "table">("grid")
  const [menuItems, setMenuItems] = useState<EditableMenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<Record<string, string>>({})
  const [editingRows, setEditingRows] = useState<EditingRowsType>({})
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    setMenuItems(extractMenuItems(response))
    setCategories(extractCategories(response))
  }, [response])

  // Memoized values
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(editingRows).some((editedItem) => {
      const originalItem = menuItems.find((item) => item.id === editedItem.id)
      if (!originalItem || editedItem.newImage) return true

      const basicFieldsChanged = ["dish", "description", "categoryId", "isVeg", "type"].some(
        (field) =>
          editedItem[field as keyof typeof editedItem] !==
          originalItem[field as keyof typeof originalItem]
      )

      if (basicFieldsChanged) return true

      const editedPrices = editedItem.PriceItemMap || []
      const originalPrices = originalItem.PriceItemMap || []

      if (editedPrices.length !== originalPrices.length) return true

      return editedPrices.some((editedPrice, index) => {
        const originalPrice = originalPrices[index]
        return (
          String(editedPrice.price).trim() !== String(originalPrice.price).trim() ||
          String(editedPrice.portion).trim() !== String(originalPrice.portion).trim()
        )
      })
    })
  }, [editingRows, menuItems])

  const filteredMenuItems = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase()
    return menuItems.filter(
      (item) =>
        item.dish.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower) ||
        categories[item.categoryId].toLowerCase().includes(searchTermLower)
    )
  }, [categories, menuItems, searchTerm])

  const groupedItems = useMemo(() => {
    return filteredMenuItems.reduce(
      (acc, item) => {
        const categoryName = categories[item.categoryId]
        if (!acc[categoryName]) {
          acc[categoryName] = []
        }
        acc[categoryName].push(item)
        return acc
      },
      {} as Record<string, EditableMenuItem[]>
    )
  }, [filteredMenuItems, categories])

  // Callbacks
  const updateField = useCallback((rowId: string, field: string, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }))
  }, [])

  const updatePriceField = useCallback(
    (rowId: string, priceIndex: number, field: string, value: string) => {
      setEditingRows((prev) => {
        // Get current row data, either from editing state or original items
        const currentRow = prev[rowId] || menuItems.find((item) => item.id === rowId)
        if (!currentRow) return prev

        // Ensure we have the complete price map
        const currentPriceMap = [...(currentRow.PriceItemMap || [])]

        // Update the specific price field
        currentPriceMap[priceIndex] = {
          ...currentPriceMap[priceIndex],
          [field]: field === "price" ? parseFloat(value) : value,
          itemId: rowId, // Ensure itemId is set
        }

        // Return updated state with complete row data
        return {
          ...prev,
          [rowId]: {
            ...(prev[rowId] || currentRow),
            PriceItemMap: currentPriceMap,
          },
        }
      })
    },
    [menuItems]
  )

  const addPriceField = useCallback(
    (rowId: string) => {
      setEditingRows((prev) => {
        const currentRow = prev[rowId] || menuItems.find((item) => item.id === rowId)
        if (!currentRow) return prev

        // Add new price entry to existing ones
        const updatedPriceMap = [
          ...(currentRow.PriceItemMap || []),
          { itemId: rowId, price: 0, portion: "" },
        ]

        return {
          ...prev,
          [rowId]: {
            ...(prev[rowId] || currentRow),
            PriceItemMap: updatedPriceMap,
          },
        }
      })
    },
    [menuItems]
  )

  const removePriceField = useCallback(
    (rowId: string, priceIndex: number) => {
      setEditingRows((prev) => {
        const currentRow = prev[rowId] || menuItems.find((item) => item.id === rowId)
        if (!currentRow) return prev

        // Remove the specific price entry but keep all others
        const updatedPriceMap = [...(currentRow.PriceItemMap || [])].filter(
          (_, i) => i !== priceIndex
        )

        return {
          ...prev,
          [rowId]: {
            ...(prev[rowId] || currentRow),
            PriceItemMap: updatedPriceMap,
          },
        }
      })
    },
    [menuItems]
  )

  const setEditingRow = useCallback(
    (id: string) => {
      // Don't re-initialize if already editing this row
      if (editingRowId === id && editingRows[id]) {
        return
      }

      setEditingRowId(id)
      setEditingRows((prev) => {
        if (prev[id]) {
          return prev
        }

        const foundItem = filteredMenuItems.find((item) => item.id === id)
        if (!foundItem) {
          console.warn(`Item with id ${id} not found`)
          return prev
        }

        // Create a deep copy of the item to prevent reference issues
        const itemCopy = {
          ...foundItem,
          PriceItemMap: foundItem.PriceItemMap
            ? foundItem.PriceItemMap.map((price) => ({ ...price }))
            : [],
        }

        return {
          ...prev,
          [id]: itemCopy,
        }
      })
    },
    [editingRowId, editingRows, filteredMenuItems]
  )

  const discardRowChanges = useCallback((rowId: string) => {
    setEditingRows((prev) => {
      const { [rowId]: _, ...rest } = prev
      return rest
    })
    setEditingRowId((prev) => (prev === rowId ? null : prev))
  }, [])

  const saveRowChanges = useCallback(
    async (rowId: string) => {
      try {
        setIsUpdating(true)
        const editedRow = editingRows[rowId]
        if (!editedRow) {
          throw new Error("No changes found for this item")
        }

        const originalItem = menuItems.find((item) => item.id === rowId)
        if (!originalItem) {
          throw new Error("Original item not found")
        }

        // Prepare single item for update
        const { hasChanges, preparedData } = await prepareMenuItemForUpdate(
          editedRow,
          originalItem,
          restaurantSlug
        )

        if (!hasChanges) {
          toast({
            title: "No changes to save",
            description: "No changes were made to this menu item.",
          })
          return
        }

        // Update the item
        await updateMenuItems([preparedData])

        // Update local state
        setMenuItems(
          (prevItems) =>
            updateLocalMenuItems(prevItems, [preparedData], {
              [rowId]: editedRow,
            }) as EditableMenuItem[]
        )

        // Clear editing state for this row
        setEditingRows((prev) => {
          const { [rowId]: _, ...rest } = prev
          return rest
        })
        setEditingRowId(null)

        toast({
          title: "Changes saved successfully",
          description: "Menu item updated successfully.",
        })
      } catch (error) {
        console.error("Error saving row changes:", error)
        toast({
          title: "Error saving changes",
          description:
            error instanceof Error ? error.message : "An error occurred while saving changes.",
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    },
    [editingRows, menuItems, restaurantSlug, toast]
  )

  const saveAllChanges = useCallback(async () => {
    try {
      setIsUpdating(true)
      const changedItems = Object.values(editingRows).filter((editedItem) => {
        const originalItem = menuItems.find((item) => item.id === editedItem.id)
        return Object.keys(editedItem).some((key) => {
          if (key === "newImage") return editedItem.newImage instanceof File
          if (key === "PriceItemMap") {
            return (
              JSON.stringify(editedItem.PriceItemMap) !== JSON.stringify(originalItem?.PriceItemMap)
            )
          }
          return (editedItem as any)[key] !== (originalItem as any)?.[key]
        })
      })

      if (changedItems.length === 0) {
        toast({
          title: "No changes to save",
          description: "All menu items are up to date.",
        })
        return
      }

      // Process items sequentially if they have images to prevent race conditions
      const preparedResults = []
      for (const item of changedItems) {
        const originalItem = menuItems.find((menuItem) => menuItem.id === item.id) as MenuItemI
        const result = await prepareMenuItemForUpdate(item, originalItem, restaurantSlug)
        preparedResults.push(result)
      }

      const itemsToUpdate = preparedResults
        .filter((result) => result.hasChanges)
        .map((result) => result.preparedData)

      if (itemsToUpdate.length > 0) {
        await updateMenuItems(itemsToUpdate)
        setMenuItems(
          (prev) => updateLocalMenuItems(prev, itemsToUpdate, editingRows) as EditableMenuItem[]
        )
      }

      setEditingRows({})
      setEditingRowId(null)

      toast({
        title: "Changes saved successfully",
        description: `Updated ${itemsToUpdate.length} menu item(s).`,
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error saving changes",
        description: "An error occurred while saving the changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }, [editingRows, menuItems, restaurantSlug, toast])

  return (
    <>
      {isUpdating && <CenterLoading />}
      <div className="sticky top-0 z-10 flex w-full items-center justify-between gap-2 bg-white pb-4 dark:bg-gray-900 max-sm:flex-col">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          hasUnsavedChanges={hasUnsavedChanges}
          saveAllChanges={saveAllChanges}
        />
        <div className="flex items-center gap-x-2 max-sm:w-full">
          <WithCreateMenuDialog restaurantId={restaurantId} restaurantSlug={restaurantSlug}>
            <Button variant="outline" className="grow">
              <PlusIcon size={24} />
              <span className="ml-2">Add New Item</span>
            </Button>
          </WithCreateMenuDialog>
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>
      {view === "table" && (
        <TableView
          categories={categories}
          filteredMenuItems={groupedItems}
          editingRowId={editingRowId}
          setEditingRowId={setEditingRow}
          updateField={updateField}
          updatePriceField={updatePriceField}
          addPriceField={addPriceField}
          removePriceField={removePriceField}
          editingRows={editingRows}
          discardRowChanges={discardRowChanges}
          saveRowChanges={saveRowChanges}
        />
      )}
      {view === "grid" && (
        <GridView
          filteredMenuItems={groupedItems}
          restaurantSlug={restaurantSlug}
          restaurantId={restaurantId}
        />
      )}
    </>
  )
}

export default React.memo(RestaurantMenu)
