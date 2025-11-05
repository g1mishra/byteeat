import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code2, ExternalLink, Github, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Hero({ id }: { id: string }) {
  return (
    <div className="relative overflow-hidden pb-16 pt-20" id={id}>
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          {/* Text Content */}
          <div className="max-w-4xl space-y-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                <Sparkles className="mr-2 size-4" />
                Full Stack Project Showcase
              </Badge>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                ByteEat: Restaurant
                <span className="text-primary"> Management System</span>
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-xl leading-relaxed text-muted-foreground">
                A modern, full-stack web application for restaurant management featuring digital
                menus, QR code ordering, real-time order tracking, and comprehensive analytics.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Next.js 14", "TypeScript", "MongoDB", "Prisma", "TailwindCSS", "Cloudinary"].map(
                  (tech) => (
                    <Badge key={tech} variant="outline" className="font-normal">
                      <Code2 className="mr-1 size-3" />
                      {tech}
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/manage">
                  <ExternalLink className="mr-2 size-5" />
                  View Live Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="https://github.com/g1mishra/byte-eat-ui" target="_blank">
                  <Github className="mr-2 size-5" />
                  View Source
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
