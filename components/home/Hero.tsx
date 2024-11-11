import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"

import styles from "@/styles/home.module.css"
import { cn } from "@/lib/utils"

export default function Hero({ id }: { id: string }) {
  return (
    <div className="relative overflow-hidden pt-16" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col items-center gap-12 text-left md:flex-row">
          {/* Left Side Text Content */}
          <div className="text-center md:ml-6 md:w-1/2 md:text-left">
            {" "}
            {/* Added left margin */}
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Transform Your Restaurant with
              <span className={styles.gradientText}> Smart Digital Menu</span> Solutions
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-gray-600">
              Streamline operations, enhance customer experience, and boost revenue with our digital
              menu platform.
            </p>
            <div className="flex flex-col items-center justify-start gap-4 sm:flex-row md:justify-start">
              <Link href="/manage" className={cn(styles.primaryButton, "h-11 w-44")}>
                Start Free Trial
              </Link>
              <button className={cn(styles.secondaryButton, "h-11 w-44")}>
                <Play className="size-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Side Image Content */}
          <div className="md:w-1/2">
            <Image
              src="/Background1.png"
              alt="Digital menu demonstration"
              className="max-w-full rounded-xl"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
