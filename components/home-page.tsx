import { JSX, SVGProps } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChartIcon,
  CheckIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PrinterIcon,
  QrCodeIcon,
  SmartphoneIcon,
} from "lucide-react"

import { Button } from "./ui/button"
import { Container } from "./ui/container"

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-white shadow-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="#" prefetch={false} className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                width={80}
                height={80}
                className="object-contain"
                alt="ByteEat"
                priority
              />
            </Link>
            <nav className="flex items-center space-x-6">
              <Link
                href="#features"
                className="hover:text-primary text-sm font-medium text-gray-600"
                prefetch={false}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="hover:text-primary text-sm font-medium text-gray-600"
                prefetch={false}
              >
                Pricing
              </Link>
              <Button size="sm" asChild>
                <Link href="/manage" prefetch={false}>
                  Get Started
                </Link>
              </Button>
            </nav>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        <section className="from-primary via-primary-dark bg-gradient-to-br to-gray-900 text-white">
          <Container className="py-20 md:py-32">
            <div className="mx-auto max-w-screen-md text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
                Revolutionize Your Restaurant Experience
              </h1>
              <p className="mb-8 text-xl md:text-2xl">
                Empower your restaurant with digital menus, QR ordering, and seamless management for
                enhanced customer experiences
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/manage" prefetch={false}>
                    Get Started
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" asChild>
                  <Link href="#features" prefetch={false}>
                    Learn More
                  </Link>
                </Button> */}
              </div>
            </div>
          </Container>
        </section>

        <section id="features" className="py-20 md:py-32">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Powerful Features for Modern Restaurants
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MenuIcon className="size-10" />}
                title="Digital Menu"
                description="Create and update your menu effortlessly with high-quality images and detailed descriptions."
              />
              <FeatureCard
                icon={<QrCodeIcon className="size-10" />}
                title="QR Ordering"
                description="Enable contactless ordering directly from customers' phones, improving efficiency and reducing wait times."
              />
              <FeatureCard
                icon={<LayoutDashboardIcon className="size-10" />}
                title="Restaurant Dashboard"
                description="Manage your restaurant, track orders, and analyze performance all in one place."
              />
              <FeatureCard
                icon={<PrinterIcon className="size-10" />}
                title="Custom-Built POS System"
                description="Our in-house Point of Sale system is fully integrated with all ByteEat features, ensuring seamless and efficient restaurant operations."
              />
              <FeatureCard
                icon={<BarChartIcon className="size-10" />}
                title="Analytics"
                description="Gain valuable insights into your restaurant's performance with detailed analytics and reports."
              />
              <FeatureCard
                icon={<SmartphoneIcon className="size-10" />}
                title="Mobile-Friendly"
                description="Provide a smooth experience for customers on any device with our responsive design."
              />
            </div>
          </Container>
        </section>

        <section id="pricing" className="bg-gray-100 py-20 md:py-32">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Choose the Perfect Plan for Your Restaurant
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <PricingCard
                title="Starter"
                price="₹1,999"
                description="Perfect for small restaurants taking their first step into the digital world"
                features={[
                  "Digital Menu",
                  "Easy menu updates",
                  "Organize menu items",
                  "Basic customization",
                  "Account access",
                ]}
              />
              <PricingCard
                title="Pro"
                price="₹7,999"
                description="Ideal for growing restaurants with advanced needs"
                features={[
                  "All Starter features",
                  "QR Ordering",
                  "Built-in POS System",
                  "Live Order View",
                  "Advanced Analytics",
                  "Priority Support",
                ]}
                highlighted={true}
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                description="Tailored solutions for large restaurant chains"
                features={[
                  "All Pro features",
                  "Custom Integrations",
                  "Dedicated Account Manager",
                  "24/7 Premium Support",
                  "Customized Reporting",
                ]}
              />
            </div>
          </Container>
        </section>
      </main>
      <footer className="bg-gray-900 py-12 text-white">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center">
              <BinaryIcon className="mr-2 size-6" />
              <span className="text-lg font-semibold">ByteEat</span>
            </div>
            <p className="text-sm">&copy; 2024 ByteEat. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link href="/about" className="text-sm hover:underline" prefetch={false}>
                About
              </Link>
              <Link href="/privacy" className="text-sm hover:underline" prefetch={false}>
                Privacy Policy
              </Link>
            </nav>
          </div>
        </Container>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center drop-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className={`flex flex-col rounded-lg p-6 shadow-md ${
        highlighted ? "bg-primary text-white" : "bg-white"
      }`}
    >
      <h3 className="mb-2 text-2xl font-bold">{title}</h3>
      <p className="mb-4 text-3xl font-semibold">{price}</p>
      <p className="mb-6 text-sm">{description}</p>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className="mr-2 size-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/manage"
        className={`mt-auto rounded-md px-4 py-2 text-center ${
          highlighted
            ? "text-primary bg-white hover:bg-gray-100"
            : "bg-primary hover:bg-primary-dark text-white"
        } transition-colors`}
        prefetch={false}
      >
        Get Started
      </Link>
    </div>
  )
}

function BinaryIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="14" width="4" height="6" rx="2" />
      <rect x="6" y="4" width="4" height="6" rx="2" />
      <path d="M6 20h4" />
      <path d="M14 10h4" />
      <path d="M6 14h2v6" />
      <path d="M14 4h2v6" />
    </svg>
  )
}
