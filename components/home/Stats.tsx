import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Shield, Smartphone } from "lucide-react"
import React from "react"

export default function Stats({ id }: { id: string }) {
  const stats = [
    {
      number: "15+",
      label: "Database Models",
      icon: Database,
    },
    {
      number: "50+",
      label: "API Endpoints",
      icon: Code,
    },
    {
      number: "TypeScript",
      label: "Type-Safe Code",
      icon: Shield,
    },
    {
      number: "100%",
      label: "Responsive Design",
      icon: Smartphone,
    },
  ]

  return (
    <div className="bg-muted/30 py-20" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Project Highlights</h2>
          <p className="text-lg text-muted-foreground">
            Demonstrating full-stack development expertise
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-xl bg-primary p-3 text-primary-foreground shadow transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-4xl font-bold">{stat.number}</div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
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
