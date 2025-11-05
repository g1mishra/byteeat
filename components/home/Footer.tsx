import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t bg-muted/30">
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl font-bold">ByteEat</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Full-stack restaurant management system built with modern web technologies. A
              portfolio project showcasing end-to-end development skills.
            </p>
          </div>

          {/* Project Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Project Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Features", href: "#features" },
                { label: "Tech Stack", href: "#pricing" },
                { label: "Contact", href: "#contact" },
                {
                  label: "GitHub",
                  href: "https://github.com/g1mishra/byte-eat-ui",
                  external: true,
                },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                    {item.external && <ExternalLink className="size-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Technologies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js 14</li>
              <li>TypeScript</li>
              <li>MongoDB + Prisma</li>
              <li>TailwindCSS</li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Explore the Project</h4>
            <p className="text-sm text-muted-foreground">
              Check out the live demo to see all features in action.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/manage">
                  <ExternalLink className="mr-2 size-4" />
                  View Demo
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://github.com/g1mishra/byte-eat-ui" target="_blank">
                  <Github className="mr-2 size-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ByteEat. Built by{" "}
            <Link
              href="https://github.com/g1mishra"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              g1mishra
            </Link>{" "}
            as a full-stack portfolio project.
          </p>
        </div>
      </div>
    </footer>
  )
}
