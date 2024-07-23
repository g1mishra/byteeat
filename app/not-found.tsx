import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import AnimatingEmoji from "@/components/rolling_emojis"

export default function NotFound() {
  return (
    <div className="bg-my-blue flex h-screen justify-center px-4 pt-5">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center lg:gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold lg:text-6xl">
              ByteEat {<AnimatingEmoji />}
            </h1>
            <h2 className="text-muted-foreground text-lg font-light lg:text-3xl">
              Our ByteEat couldn’t find the page you are looking for.
            </h2>
          </div>
          <Link href="/" className={`${cn(buttonVariants({ size: "lg" }))}`}>
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
