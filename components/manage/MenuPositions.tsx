"use client"

import { ItemCategory } from "@prisma/client"

import "react-phone-input-2/lib/style.css"

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const MenuPositions = ({ itemCategory }: { itemCategory?: ItemCategory[] }) => {
  return (
    <div className="container mx-auto py-4">
      <CategoryTable itemCategory={itemCategory} />
    </div>
  )
}

export default MenuPositions

const CategoryTable = ({ itemCategory }: { itemCategory?: ItemCategory[] }) => {
  if (!itemCategory) return null
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Category Position</TableCell>
          <TableCell>Category Name</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemCategory.map((category, index) => (
          <TableRow key={category.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{category.categoryName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
