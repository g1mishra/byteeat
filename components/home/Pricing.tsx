import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import React from "react"

const techStack = [
  {
    name: "Frontend",
    description: "Modern React Framework",
    features: [
      "Next.js 14 (App Router)",
      "TypeScript for type safety",
      "TailwindCSS + shadcn/ui",
      "Responsive design",
    ],
  },
  {
    name: "Backend & Database",
    description: "Scalable Backend Architecture",
    features: [
      "Next.js API Routes",
      "MongoDB (NoSQL Database)",
      "Prisma ORM",
      "NextAuth.js authentication",
      "Server-side rendering",
    ],
    popular: true,
  },
  {
    name: "DevOps & Tools",
    description: "Modern Development Workflow",
    features: [
      "Cloudinary for image storage",
      "Git version control",
      "ESLint + Prettier",
      "Vercel deployment ready",
    ],
  },
]

export default function Pricing({ id }: { id: string }) {
  return (
    <div className="bg-white py-24" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary">Technology</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Technology Stack</h2>
          <p className="text-lg text-muted-foreground">
            Built with modern, industry-standard technologies
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {techStack.map((stack) => (
            <Card
              key={stack.name}
              className={`relative border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                stack.popular ? "border-indigo-500 shadow-xl shadow-indigo-500/10" : ""
              }`}
            >
              {stack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                    <Sparkles className="mr-1 size-3" />
                    Core Stack
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-2xl">{stack.name}</CardTitle>
                <CardDescription className="text-base">{stack.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {stack.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <div className="mt-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5">
                        <Check className="size-3 text-white" strokeWidth={3} />
                      </div>
                      <span className="flex-1 text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
