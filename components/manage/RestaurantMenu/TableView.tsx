import React, { Dispatch, SetStateAction, Suspense, useMemo } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { MenuItemI, PriceItemMapI } from "@/services/menuService"
import { ItemType } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, PlusIcon, Save, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import VegOrNonVeg from "@/components/veg-or-nonveg"

const LazyAccordion = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => ({ default: mod.Accordion }))
)
const LazyAccordionContent = dynamic(() =>
  import("@/components/ui/accordion").then((mod) => ({ default: mod.AccordionContent }))
)
interface TableViewProps {
  filteredMenuItems: Record<
    string,
    (MenuItemI & {
      categoryName: string
      newImage?: File
    })[]
  >
  updateField: (rowId: string, field: string, value: any) => void
  updatePriceField: (rowId: string, priceIndex: number, field: string, value: string) => void
  addPriceField: (rowId: string) => void
  categories: { [key: string]: string }
  removePriceField: (rowId: string, priceIndex: number) => void
  editingRowId: string | null
  setEditingRowId: (id: string) => void
  editingRows: { [key: string]: MenuItemI & { categoryName: string; newImage?: File } }
  saveRowChanges: (rowId: string) => void
  discardRowChanges: (rowId: string) => void
}

const TableView: React.FC<TableViewProps> = ({
  filteredMenuItems,
  updateField,
  updatePriceField,
  addPriceField,
  categories,
  removePriceField,
  editingRowId,
  setEditingRowId,
  editingRows,
  saveRowChanges,
  discardRowChanges,
}) => {
  const columns = useMemo<ColumnDef<MenuItemI & { categoryName: string }>[]>(
    () => [
      {
        accessorKey: "dish",
        header: "Dish",
        maxSize: 200,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const value = editingRows[row.original.id]?.dish ?? row.original.dish
          return editing ? (
            <Input value={value} onChange={(e) => updateField(row.id, "dish", e.target.value)} />
          ) : (
            value
          )
        },
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        maxSize: 180,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const value = editingRows[row.original.id]?.categoryId ?? row.original.categoryId
          return editing ? (
            <Select
              value={value}
              onValueChange={(selectedValue) => {
                updateField(row.id, "categoryId", selectedValue)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            categories[value] || "Unknown Category"
          )
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        maxSize: 200,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const value = editingRows[row.original.id]?.description ?? row.original.description
          return editing ? (
            <Input
              value={value}
              onChange={(e) => updateField(row.id, "description", e.target.value)}
            />
          ) : (
            value
          )
        },
      },
      {
        accessorKey: "isVeg",
        header: "Veg/Non-Veg",
        maxSize: 120,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const value = editingRows[row.original.id]?.isVeg ?? row.original.isVeg
          return editing ? (
            <Checkbox
              checked={value}
              onCheckedChange={(checked) => updateField(row.id, "isVeg", checked)}
            />
          ) : (
            <VegOrNonVeg isVeg={value} />
          )
        },
      },
      {
        accessorKey: "itemType",
        header: "Type",
        maxSize: 120,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const value = editingRows[row.original.id]?.type ?? row.original.type
          return editing ? (
            <Select value={value} onValueChange={(value) => updateField(row.id, "type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ItemType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            value
          )
        },
      },
      {
        accessorKey: "imgPath",
        header: "Image",
        maxSize: 120,
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const imgPath = editingRows[row.original.id]?.imgPath ?? row.original.imgPath
          const newImage = editingRows[row.original.id]?.newImage ?? null

          const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
              updateField(row.id, "newImage", file)
            }
          }

          const imageToShow = newImage
            ? URL.createObjectURL(newImage)
            : imgPath
            ? imgPath.split(";")[0]
            : null

          return (
            <div className="relative size-16">
              {imageToShow ? (
                <>
                  <Image
                    src={imageToShow}
                    alt={row.original.dish}
                    fill
                    className="rounded-md object-cover"
                  />
                  {editing && (
                    <Label
                      htmlFor={`image-upload-${row.original.id}`}
                      className="absolute right-0 top-0 cursor-pointer rounded-bl-md rounded-tr-md bg-white/80 p-1 transition-colors hover:bg-white"
                    >
                      <Pencil size={16} />
                    </Label>
                  )}
                </>
              ) : editing ? (
                <Label
                  htmlFor={`image-upload-${row.original.id}`}
                  className="flex size-full cursor-pointer items-center justify-center rounded-md bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                >
                  <PlusIcon size={24} />
                </Label>
              ) : null}
              {editing && (
                <Input
                  type="file"
                  id={`image-upload-${row.original.id}`}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "PriceItemMap",
        header: "Price",
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const priceItemMap =
            editingRows[row.original.id]?.PriceItemMap ?? row.original.PriceItemMap
          return (
            <div>
              {priceItemMap?.map((priceItem: PriceItemMapI, index: number) => (
                <div key={index} className="mb-2 flex items-center gap-2">
                  {editing ? (
                    <>
                      <Input
                        value={priceItem.portion ?? ""}
                        onChange={(e) => updatePriceField(row.id, index, "portion", e.target.value)}
                        placeholder="Portion"
                        className="w-24"
                      />
                      <Input
                        type="number"
                        value={priceItem.price ?? ""}
                        onChange={(e) => updatePriceField(row.id, index, "price", e.target.value)}
                        placeholder="Price"
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePriceField(row.id, index)}
                      >
                        <Trash2 size={22} />
                      </Button>
                    </>
                  ) : (
                    <span className="capitalize">
                      {priceItem?.portion ? `${priceItem.portion} : ` : ""} ₹{priceItem.price}
                    </span>
                  )}
                </div>
              ))}

              {(!priceItemMap?.length || editing) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPriceField(row.id)}
                >
                  <PlusIcon size={22} className="mr-2" /> Add Price
                </Button>
              )}
            </div>
          )
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const editing = editingRowId === row.original.id
          const hasUnsavedChanges = !!editingRows[row.original.id]
          return (
            <div className="flex items-center space-x-2">
              {editing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => saveRowChanges(row.original.id)}>
                    <Save className="mr-2 size-4" /> Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => discardRowChanges(row.original.id)}
                  >
                    <X className="mr-2 size-4" /> Discard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRowId(row.original.id)}
                  >
                    <Pencil className="mr-2 size-4" /> Edit
                  </Button>
                  {hasUnsavedChanges && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => discardRowChanges(row.original.id)}
                      >
                        <Trash2 className="mr-2 size-4" /> Discard
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          )
        },
      },
    ],
    [
      editingRowId,
      editingRows,
      updateField,
      categories,
      updatePriceField,
      removePriceField,
      addPriceField,
      saveRowChanges,
      setEditingRowId,
      discardRowChanges,
    ]
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {Object.entries(filteredMenuItems).map(([categoryName, items]) => (
        <LazyAccordion
          key={categoryName}
          defaultValue={categoryName}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem className="mt-4 first:mt-0" id={categoryName} value={categoryName}>
            <AccordionTrigger className="text-lg font-bold capitalize !no-underline">
              {categoryName} ({items.length})
            </AccordionTrigger>
            <Suspense fallback={<div>Loading category content...</div>}>
              <LazyAccordionContent>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={`${column.id}-${index}`}
                            className={cn(
                              "border-b border-gray-200 p-2 text-left font-semibold text-gray-600",
                              column.id === "actions" && "w-40"
                            )}
                          >
                            {typeof column.header === "function"
                              ? column.header({} as any)
                              : column.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={`${item.id}-${index}`} className={cn("border-b border-gray-200")}>
                          {columns.map((column, columnIndex) => (
                            <td
                              key={`${column.id}-${columnIndex}`}
                              className={cn("p-2", column.id === "actions" && "w-40")}
                            >
                              {typeof column.cell === "function"
                                ? column.cell({
                                    row: {
                                      original: item,
                                      id: item.id,
                                    },
                                  } as any)
                                : column.cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LazyAccordionContent>
            </Suspense>
          </AccordionItem>
        </LazyAccordion>
      ))}
    </Suspense>
  )
}

export default TableView
