import { Check, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


const SearchBar = ({
  searchTerm,
  setSearchTerm,
  hasUnsavedChanges,
  saveAllChanges,
}: {
  searchTerm: string
  setSearchTerm: (value: string) => void
  hasUnsavedChanges: boolean
  saveAllChanges: () => void
}) => (
  <div className="flex grow items-center gap-x-2 max-sm:w-full">
    <div className="relative grow">
      <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search dishes, categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-8"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          type="button"
        >
          ×
        </button>
      )}
    </div>

    {hasUnsavedChanges && (
      <Button onClick={saveAllChanges} size="sm" className="ml-4">
        <Check className="mr-2 size-4" /> Save All
      </Button>
    )}
  </div>
)

export default SearchBar
