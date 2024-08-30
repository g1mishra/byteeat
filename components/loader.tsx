import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const Loading = ({ className = "" }) => (
  <div
    className={cn(
      `flex h-20 items-center justify-center rounded-lg ${className}`
    )}
  >
    <Loader2 className="text-primary size-8 animate-spin" />
  </div>
)

export default Loading
