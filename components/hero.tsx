import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import AnimatingEmoji from "./rolling_emojis"

export default function HeroHeader() {
  return (
    <section className="container flex h-screen flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center lg:gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold lg:text-6xl">
            ByteEat {<AnimatingEmoji/>}
          </h1>
          <h2 className="text-muted-foreground text-lg font-light lg:text-3xl">
            The better way to serve
          </h2>
        </div>
        <Link
          href="/manage"
          className={`w-40 ${cn(buttonVariants({ size: "lg" }))}`}
        >
          Get started
        </Link>
      </div>
    </section>
  )
}
