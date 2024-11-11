"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MapPin, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import styles from "@/styles/home.module.css"

import { useToast } from "../ui/use-toast"

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function Contact({ id }: { id: string }) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const { toast } = useToast()
  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to send message")
      }

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      })

      // form.reset()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`py-24 ${styles.sectionGradient}`} id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className="text-lg text-gray-600">We&apos;d love to hear from you</p>
        </div>
        <div className="grid gap-16 md:grid-cols-2">
          {/* Contact Information */}
          <div className={`${styles.cardGradient} rounded-2xl p-8`}>
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-xl font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="mr-3 size-5 text-indigo-600" />
                    <a
                      href="mailto:byteeat.in@gmail.com"
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      byteeat.in@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-3 size-5 text-indigo-600" />
                    <a href="tel:+918447509186" className="text-gray-600 hover:text-indigo-600">
                      +91 84475 09186
                    </a>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-3 mt-1 size-5 text-indigo-600" />
                    <span className="text-gray-600">
                      Rama Mandi
                      <br />
                      Jalandhar, PN 144005
                      <br />
                      India
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-xl font-semibold text-gray-900">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
                  <p>Saturday: 10:00 AM - 4:00 PM (IST)</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${styles.cardGradient} rounded-2xl p-8`}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="mb-2 block text-gray-700">Name</label>
                <input
                  {...form.register("name")}
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-gray-700">Email</label>
                <input
                  {...form.register("email")}
                  type="email"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-gray-700">Message</label>
                <textarea
                  {...form.register("message")}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                ></textarea>
                {form.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={`${styles.primaryButton} w-full`}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
