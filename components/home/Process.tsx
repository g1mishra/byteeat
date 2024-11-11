"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ClipboardEdit, QrCode, Rocket, UserPlus } from "lucide-react"

import styles from "@/styles/home.module.css"

const steps = [
  {
    icon: <UserPlus className="size-8" />,
    title: "Sign Up",
    description: "Create your account in minutes with our simple registration process",
    gradient: "from-blue-500 to-indigo-600",
    animation: "fade-right",
  },
  {
    icon: <ClipboardEdit className="size-8" />,
    title: "Customize Menu",
    description: "Upload your menu items and add images and descriptions",
    gradient: "from-indigo-600 to-purple-600",
    animation: "fade-up",
  },
  {
    icon: <QrCode className="size-8" />,
    title: "Generate QR",
    description: "Create unique QR codes and customize for each table",
    gradient: "from-purple-600 to-pink-600",
    animation: "fade-up",
  },
  {
    icon: <Rocket className="size-8" />,
    title: "Go Live",
    description: "Start accepting digital orders and monitor in real-time",
    gradient: "from-pink-600 to-rose-600",
    animation: "fade-left",
  },
]
export default function Process({ id }: { id: string }) {
  const router = useRouter()
  return (
    <div className={`py-24 ${styles.sectionGradient}`} id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>Get Started in 4 Simple Steps</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Launch your digital menu in minutes, not days
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute inset-x-[10%] top-1/2 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-600 to-rose-600 lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div
                  className={`absolute -top-4 left-[calc(50%-1rem)] size-8 rounded-full bg-gradient-to-r sm:-left-4 ${step.gradient} z-10 flex items-center justify-center font-bold text-white`}
                >
                  {index + 1}
                </div>

                {/* Connection Dots - Left Side */}
                {index > 0 && (
                  <div className="absolute -left-1 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
                    <div className={`size-2 rounded-full bg-gradient-to-r ${step.gradient}`} />
                  </div>
                )}

                {/* Connection Dots - Right Side */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-1 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
                    <div
                      className={`size-2 rounded-full bg-gradient-to-r ${
                        steps[index + 1].gradient
                      }`}
                    />
                  </div>
                )}

                {/* Card */}
                <div className="relative rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gray-200 group-hover:shadow-xl">
                  {/* Gradient Background Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  {/* Icon */}
                  <div
                    className={`size-16 rounded-xl bg-gradient-to-r ${step.gradient} mb-6 p-4 text-white transition-transform duration-300 group-hover:scale-110`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg
                      className={`size-6 bg-gradient-to-r bg-clip-text text-transparent ${step.gradient}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push("/manage")}
            className={`${styles.primaryButton} group`}
          >
            <span className="flex items-center">
              Get Started Now
              <Rocket className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
