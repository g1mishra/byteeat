"use client"

import React, { useState } from "react"
import { ItemCategory, Restaurant } from "@prisma/client"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

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
            <Label htmlFor="ig_url">Instagram URL</Label>
            <Input
              id="ig_url"
              placeholder="Enter Instagram URL"
              //value={response.name}
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
            <Label htmlFor="whatsapp_ph_no">Whatsapp phone number</Label>
            <PhoneInput country={'in'}>
              <Input
                id="whatsapp_ph_no"
                placeholder="Whatsapp phone number"
                type="number"
                value={response.tableSize}
              />
            </PhoneInput>
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_string">Twitter URL</Label>
            <Input
              id="twitter_url"
              placeholder="Enter Twitter URL"
              value={response.address_string}
            />
          </div>
 
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
