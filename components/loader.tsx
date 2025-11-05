import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const Loading = ({ className = "" }) => (
  <div className={cn(`flex h-20 items-center justify-center rounded-lg ${className}`)}>
    <Loader2 className="size-8 animate-spin text-primary" />
  </div>
)

export default Loading
