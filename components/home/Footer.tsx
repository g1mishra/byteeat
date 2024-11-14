import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import styles from "@/styles/home.module.css"

import InstagramIcon from "../icons/instagram"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: InstagramIcon, href: "https://instagram.com/@byteeat", label: "Instagram" },
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/50" />

      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-indigo-100 opacity-70 mix-blend-multiply blur-xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-pink-100 opacity-70 mix-blend-multiply blur-xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Top Section with Logo and Social Links */}
          <div className="flex flex-col space-y-6">
            <div className="flex space-x-3">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                ByteEat
              </span>
            </div>

            <p className="max-w-md text-left text-gray-600">
            Digital Menu Creator & Restaurant Management System
            </p>
          </div>
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Contact", "Login"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Login" ? "https://app.byteeat.in" : `#${item.toLowerCase()}`}
                    className="group flex items-center text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    <span className="mr-2 size-1.5 rounded-full bg-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:byteeat.in@gmail.com"
                  className="group flex items-center text-gray-600 transition-colors hover:text-indigo-600"
                >
                  <div className="mr-3 rounded-lg bg-white p-2 shadow-md transition-all duration-300 group-hover:shadow-lg">
                    <Mail className="size-4" />
                  </div>
                  byteeat.in@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918447509186"
                  className="group flex items-center text-gray-600 transition-colors hover:text-indigo-600"
                >
                  <div className="mr-3 rounded-lg bg-white p-2 shadow-md transition-all duration-300 group-hover:shadow-lg">
                    <Phone className="size-4" />
                  </div>
                  +91 84475 09186
                </a>
              </li>
              <li className="group flex items-start text-gray-600">
                <div className="mr-3 rounded-lg bg-white p-2 shadow-md transition-all duration-300 group-hover:shadow-lg">
                  <MapPin className="size-4" />
                </div>
                <span>
                  Rama Mandi
                  <br />
                  Jalandhar, PN 144005
                  <br />
                  India
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter/CTA Section */}
          <div className="space-y-4">
            <h3 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
              Get Started Today
            </h3>
            <p className="text-gray-600">
              Ready to transform your restaurant? Start your free trial now.
            </p>
            <Link href="/manage" className={`${styles.primaryButton} inline-block`}>
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-gray-200/50 py-8 text-center">
          <p className="text-gray-600">© {currentYear} ByteEat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
