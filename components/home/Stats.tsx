import React from "react"

import styles from "@/styles/home.module.css"

export default function Stats({ id }: { id: string }) {
  const stats = [
    { number: "10+", label: "Restaurants Served" },
    { number: "50+", label: "Digital Menus Created" },
    { number: "1000+", label: "Orders Processed" },
    { number: "99%", label: "Customer Satisfaction" },
  ]

  return (
    <div className="bg-white py-16" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className={`${styles.statsCard} p-6 text-center`}>
              <div className="mb-2 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
