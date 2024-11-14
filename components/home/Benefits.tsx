import React from "react"
import { BarChart, Clock, DollarSign, Smile } from "lucide-react"

import styles from "@/styles/home.module.css"

const benefits = [
  {
    icon: <Clock className="text-accent size-12" />,
    title: "Increased Efficiency",
    stats: "Reduce order time by 50%",
    description: "Minimize human errors and streamline your operations",
  },
  {
    icon: <DollarSign className="text-accent size-12" />,
    title: "Cost Reduction",
    stats: "Save on printing costs",
    description: "Optimize staff efficiency and reduce operational expenses",
  },
  {
    icon: <Smile className="text-accent size-12" />,
    title: "Enhanced Experience",
    stats: "Modern dining experience",
    description: "Deliver faster service and improve customer satisfaction",
  },
  {
    icon: <BarChart className="text-accent size-12" />,
    title: "Better Insights",
    stats: "Data-driven decisions",
    description: "Gain valuable customer behavior analytics",
  },
]
export default function Benefits({ id }: { id: string }) {
  return (
    <div className="bg-white py-24" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>Transform Your Restaurant Operations</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className={`${styles.cardGradient} rounded-2xl p-6 text-center`}>
              <div className={`${styles.iconGradient} mx-auto mb-4 inline-block`}>
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{benefit.title}</h3>
              <div className="mb-2 font-semibold text-indigo-600">{benefit.stats}</div>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
