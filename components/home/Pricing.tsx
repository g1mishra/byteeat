import React from "react"
import { Check } from "lucide-react"

import styles from "@/styles/home.module.css"

const plans = [
  {
    name: "Starter",
    price: "199",
    description: "Best for small restaurants",
    features: [
      "Digital menu creation",
      "Basic QR code generation",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    name: "Professional",
    price: "799",
    description: "Best for growing businesses",
    features: [
      "Everything in Starter",
      "Advanced menu customization",
      "Table-specific QR codes",
      "Priority support",
      "Advanced analytics",
      "Multi-language support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Best for large operations",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "Customization Design",
      "Advanced security features",
    ],
  },
]
export default function Pricing({ id }: { id: string }) {
  return (
    <div className="bg-white py-24" id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">Choose the perfect plan for your restaurant</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.testimonialCard} relative p-8 ${
                plan.popular ? "border-2 border-indigo-600" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </span>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <Check className="mr-2 size-5 text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full ${
                    plan.popular ? styles.primaryButton : styles.secondaryButton
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
