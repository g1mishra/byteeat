import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

const ViewToggle = ({
  view,
  setView,
}: {
  view: "grid" | "table"
  setView: (value: "grid" | "table") => void
}) => (
  <div className="inline-flex rounded-md border">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setView("grid")}
      className={`rounded-r-none border-r ${view === "grid" ? "bg-secondary" : ""}`}
    >
      <LayoutGrid className="mr-2 size-4" /> Grid
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setView("table")}
      className={`rounded-l-none ${view === "table" ? "bg-secondary" : ""}`}
    >
      <List className="mr-2 size-4" /> Table
    </Button>
  </div>
)

export default ViewToggle
