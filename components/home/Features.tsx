import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Check, Code2, LayoutGrid, Users } from "lucide-react"
import React from "react"

const featureCategories = [
  {
    title: "Menu Management",
    icon: LayoutGrid,
    description:
      "Full CRUD operations for menu items with category organization and image uploads.",
    features: [
      "Digital menu creation",
      "Real-time updates",
      "Category organization",
      "Cloudinary image integration",
    ],
  },
  {
    title: "Customer Experience",
    icon: Users,
    description: "QR code-based ordering system with intuitive UI and responsive design.",
    features: ["QR code ordering", "Responsive design", "Shopping cart", "Order history"],
  },
  {
    title: "Business Operations",
    icon: BarChart2,
    description: "Comprehensive dashboard with real-time order tracking and analytics.",
    features: ["Order management", "Real-time updates", "Analytics dashboard", "Staff roles"],
  },
  {
    title: "Technical Stack",
    icon: Code2,
    description: "Built with modern technologies and best practices for scalability.",
    features: [
      "Next.js 14 (App Router)",
      "MongoDB + Prisma ORM",
      "TypeScript",
      "TailwindCSS + shadcn/ui",
    ],
  },
]

export default function Features({ id }: { id: string }) {
  return (
    <div className="bg-background py-24" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Key Features & Technologies
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A showcase of modern web development practices and full-stack capabilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {featureCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-4">
                    <div className="rounded-xl bg-primary p-3 text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{category.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3 text-primary" strokeWidth={3} />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
