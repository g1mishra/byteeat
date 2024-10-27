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
    isSearchActive: boolean
  }
  setFilters?: Dispatch<
    SetStateAction<{
      isFood: boolean
      searchValue: string
      isSearchActive: boolean
    }>
  >
}

const SearchAndFilter: React.FC<Props> = ({
  filters: { isFood, isSearchActive, searchValue: initialSearchValue },
  setFilters,
}) => {
  const [openSearch, setOpenSearch] = useState(isSearchActive)
  const [searchValue, setSearchValue] = useState(initialSearchValue)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (setFilters) {
      debounce(
        () =>
          setFilters((prev) => ({
            ...prev,
            searchValue: value,
            isSearchActive: value.trim().length > 0,
          })),
        300
      )()
    }
  }

  const handleClear = () => {
    setSearchValue("")
    setFilters?.((prev) => ({
      ...prev,
      searchValue: "",
      isSearchActive: false,
    }))
  }

  return (
    <div className="flex items-center justify-between">
      {openSearch || isSearchActive ? (
        <div className="w-full self-end">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
            <Input
              autoFocus
              placeholder="Search"
              className="w-full pl-8 pr-8 outline-none focus:border-none focus:ring-0"
              value={searchValue}
              onChange={handleSearch}
              onBlur={() => {
                if (!searchValue.trim()) {
                  setOpenSearch(false)
                }
              }}
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
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
