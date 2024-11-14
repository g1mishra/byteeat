"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import styles from "@/styles/home.module.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Image
            
              src="/logo.png"
              width={80}
              height={80}
              className="object-contain"
              alt="ByteEat | Digital Menu Creator & Restaurant Management System"
              priority
            />
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="#solutions" className="text-gray-600 hover:text-indigo-600">
              Solutions
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-indigo-600">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-indigo-600">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-indigo-600">
              Contact
            </Link>
            <Link href="/manage" className={styles.primaryButton}>
              Get Started Free
            </Link>
          </div>

          <button className="text-indigo-600 md:hidden">{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="#solutions" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
              Solutions
            </Link>
            <Link href="#features" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
              Features
            </Link>
            <Link href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
              Pricing
            </Link>
            <Link href="#contact" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
              Contact
            </Link>
            <Link href="/manage" className={`${styles.primaryButton} w-full text-center`}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
