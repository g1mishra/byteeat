"use client"

import React, { useState } from "react"
import { ItemCategory, Restaurant } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import LogoOrAvatar from "@/components/logo-or-avatar"

export default function EditPage({
  response,
}: {
  response: Restaurant & { ItemCategory: ItemCategory[] }
}) {
  const [file, setFile] = useState<File>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file && file.name != null) {
      const formData = new FormData()
      formData.append("slug", response?.slug)
      formData.append("file", file)

      fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }

  return (
    <>
      <LogoOrAvatar
        name={response.name}
        src={response?.logoUrl || ""}
        className="size-32"
      />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              placeholder="Enter restaurant name"
              value={response.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0])
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tableSize">Table Size</Label>
            <Input
              id="tableSize"
              placeholder="Enter table size"
              type="number"
              value={response.tableSize}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_string">Address</Label>
            <Input
              id="address_string"
              placeholder="Enter address"
              value={response.address_string}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Enter city" value={response.city} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Enter state"
              value={response.state}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="Enter country"
              value={response.country}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fonts">Fonts</Label>
            <Input id="fonts" placeholder="Enter fonts" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryOrder">Category Order</Label>
          <CategoryTable itemCategory={response.ItemCategory} />
        </div>
        <Button className="mt-4">Save</Button>
      </form>
    </>
  )
}

const CategoryTable = ({ itemCategory }: { itemCategory: ItemCategory[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Category Position</TableCell>
          <TableCell>Category Name</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemCategory.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.position}</TableCell>
            <TableCell>{category.categoryName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
