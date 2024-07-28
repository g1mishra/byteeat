import { cn } from "@/lib/utils"

const ItemLabel = ({ label }: { label: string }) => {
  return (
    <div
      className={cn(
        "flex h-4 items-center justify-center rounded p-1 px-2 py-0.5 text-center text-xs font-medium text-white lg:h-[1.4rem] lg:text-sm",
        getLabelColor(label)
      )}
    >
      {label}
    </div>
  )
}

const getLabelColor = (label: string) => {
  switch (label.toLowerCase()) {
    case "must-try":
      return "bg-[#23537C]"
    case "bestseller":
      return "bg-[#D58C43]"
    default:
      return "bg-gray-200"
  }
}

export default ItemLabel
