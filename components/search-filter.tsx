"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Search } from "lucide-react"

import { debounce } from "@/lib/utils"

import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

interface Props {
  filters: {
    isFood: boolean
    searchValue: string
  }
  setFilters?: Dispatch<
    SetStateAction<{
      isFood: boolean
      searchValue: string
    }>
  >
}

const SearchAndFilter: React.FC<Props> = ({
  filters: { isFood },
  setFilters,
}) => {
  const [openSearch, setOpenSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)

    if (setFilters) {
      debounce(
        () =>
          setFilters((prev) => ({
            ...prev,
            searchValue: e.target.value,
          })),
        300
      )()
    }
  }

  return (
    <div className="flex items-center justify-between">
      {openSearch ? (
        <div className="w-full">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
            <Input
              autoFocus
              placeholder="Search"
              className="w-full pl-8 outline-none focus:border-none focus:ring-0"
              value={searchValue}
              onChange={handleSearch}
              onBlur={() => {
                setOpenSearch(false)
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2 text-base">
            <Label htmlFor="menu-toggle">Bar menu 🥂</Label>
            <Switch
              checked={!isFood}
              onCheckedChange={() =>
                setFilters?.((prev) => ({
                  ...prev,
                  isFood: !isFood,
                }))
              }
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
