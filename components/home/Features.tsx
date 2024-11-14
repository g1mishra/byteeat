import React from "react"
import { BarChart2, LayoutGrid, Megaphone, Users } from "lucide-react"

import styles from "@/styles/home.module.css"

const featureCategories = [
  {
    title: "Menu Management",
    icon: <LayoutGrid className="size-6" />,
    description:
      "Effortlessly manage your digital menu with real-time updates and rich media support.",
    features: [
      "Digital menu creation",
      "Real-time updates",
      "Category organization",
      "Special offers management",
    ],
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Customer Experience",
    icon: <Users className="size-6" />,
    description: "Enhance dining experience with intuitive navigation and personalized options.",
    features: ["Easy navigation", "Multi-language support", "Dietary filters", "Image gallery"],
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    title: "Business Operations",
    icon: <BarChart2 className="size-6" />,
    description: "Streamline operations with powerful management and analytics tools.",
    features: ["Order management", "Analytics dashboard", "All Order Tracking", "Staff management"],
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "Marketing Tools",
    icon: <Megaphone className="size-6" />,
    description: "Grow your business with integrated marketing and promotion features.",
    features: [
      "Promotional offers",
      "Customer feedback",
      "Social media integration",
    ],
    gradient: "from-pink-600 to-rose-600",
  },
]
export default function Features({ id }: { id: string }) {
  return (
    <div className="bg-white py-24" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>Features That Set Us Apart</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Comprehensive tools and features designed to revolutionize your restaurant operations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {featureCategories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-xl"
            >
              {/* Gradient Background Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <div className="p-8">
                {/* Header */}
                <div className="mb-6 flex items-center">
                  <div
                    className={`rounded-xl bg-gradient-to-r p-3 ${category.gradient} text-white`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>

                {/* Description */}
                <p className="mb-6 text-gray-600">{category.description}</p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-700">
                      <svg
                        className={`size-5 shrink-0 bg-gradient-to-r ${category.gradient} rounded-full p-1`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          className="text-white"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
