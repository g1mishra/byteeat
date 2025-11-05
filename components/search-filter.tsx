"use client"

import { debounce } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { useState } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface Props {
  filters: {
    isFood: boolean
    searchValue: string
    isSearchActive: boolean
  }
  setFilters: (filters: any) => void
  theme?: {
    primaryColor: string
    secondaryColor: string
    buttonStyle: "rounded" | "square" | "pill"
  }
}

const SearchAndFilter: React.FC<Props> = ({
  filters: { isFood, isSearchActive, searchValue: initialSearchValue },
  setFilters,
  theme,
}) => {
  const [searchValue, setSearchValue] = useState(initialSearchValue)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (setFilters) {
      debounce(
        () =>
          setFilters((prev: any) => ({
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
    setFilters?.((prev: any) => ({
      ...prev,
      searchValue: "",
      isSearchActive: false,
    }))
  }

  const buttonClasses =
    theme?.buttonStyle === "pill"
      ? "rounded-full"
      : theme?.buttonStyle === "square"
        ? "rounded-none"
        : "rounded-lg"

  return (
    <div className="sticky top-0 z-10 space-y-3 border-b bg-white p-4 shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search dishes..."
          value={searchValue}
          onChange={handleSearch}
          className={`h-11 border-2 px-9 transition-all focus-visible:ring-2 ${buttonClasses}`}
          style={{
            borderColor: searchValue ? theme?.primaryColor : undefined,
            ...(searchValue &&
              ({
                "--tw-ring-color": theme?.primaryColor,
              } as React.CSSProperties)),
          }}
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={isFood ? "default" : "outline"}
          onClick={() => setFilters((prev: any) => ({ ...prev, isFood: true }))}
          className={`h-10 flex-1 font-medium transition-all ${buttonClasses} ${
            isFood ? "shadow-sm" : "hover:bg-accent"
          }`}
          style={
            isFood
              ? {
                  backgroundColor: theme?.primaryColor,
                  color: theme?.secondaryColor,
                  borderColor: theme?.primaryColor,
                }
              : {
                  borderColor: theme?.primaryColor + "40",
                  color: theme?.primaryColor,
                }
          }
        >
          🍽️ Food
        </Button>

        <Button
          variant={!isFood ? "default" : "outline"}
          onClick={() => setFilters((prev: any) => ({ ...prev, isFood: false }))}
          className={`h-10 flex-1 font-medium transition-all ${buttonClasses} ${
            !isFood ? "shadow-sm" : "hover:bg-accent"
          }`}
          style={
            !isFood
              ? {
                  backgroundColor: theme?.primaryColor,
                  color: theme?.secondaryColor,
                  borderColor: theme?.primaryColor,
                }
              : {
                  borderColor: theme?.primaryColor + "40",
                  color: theme?.primaryColor,
                }
          }
        >
          🍺 Bar
        </Button>
      </div>
    </div>
  )
}

export default SearchAndFilter
