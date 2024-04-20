"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

interface Props {
  isFood: boolean
  setIsFood: (isFood: boolean) => void
}

const SearchAndFilter: React.FC<Props> = ({ isFood, setIsFood }) => {
  const [openSearch, setOpenSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="flex items-center justify-between">
      {openSearch ? (
        <form className=" w-full">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
            <Input
              autoFocus
              placeholder="Search"
              className="w-full pl-8 outline-none focus:border-none focus:ring-0"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              onBlur={() => {
                setOpenSearch(false)
              }}
            />
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center space-x-2 text-base">
            <Label htmlFor="menu-toggle">Bar menu 🥂</Label>
            <Switch
              checked={!isFood}
              onCheckedChange={() => setIsFood(!isFood)}
              id="menu-toggle"
              aria-label="Toggle between Bar and Food menus"
              className="text-base"
            />
          </div>
          <div
            onClick={() => {
              setOpenSearch(!openSearch)
            }}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 p-2"
          >
            <Search className="text-gray-600" />
          </div>
        </>
      )}
    </div>
  )
}

export default SearchAndFilter
