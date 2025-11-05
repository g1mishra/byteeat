import {
  BarChartIcon,
  CheckIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PrinterIcon,
  QrCodeIcon,
  SmartphoneIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { JSX, SVGProps } from "react"

import { Button } from "./ui/button"
import { Container } from "./ui/container"

export default function HomePageV2() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50">
      {/* Modern Floating Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur-lg">
        <Container>
          <div className="flex h-20 items-center justify-between">
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
            <nav className="hidden items-center space-x-8 md:flex">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-main"
                prefetch={false}
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-main"
                prefetch={false}
              >
                Benefits
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-main"
                prefetch={false}
              >
                Pricing
              </Link>
              <Button size="sm" variant="default" className="shadow-lg shadow-main/25" asChild>
                <Link href="/manage" prefetch={false}>
                  Get Started
                </Link>
              </Button>
            </nav>
            <Button variant="ghost" className="md:hidden">
              <MenuIcon className="size-6" />
            </Button>
          </div>
        </Container>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section with 3D Elements */}
        <section className="relative overflow-hidden bg-zinc-900 py-24 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-main/20 to-purple-500/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
          </div>
          <Container className="relative z-10">
            <div className="mx-auto max-w-screen-lg text-center">
              <div className="mb-6 inline-flex rounded-full bg-white/10 px-6 py-2 backdrop-blur-xl">
                <span className="bg-gradient-to-r from-yellow-300 to-main bg-clip-text text-sm font-medium text-transparent">
                  Trusted by 1000+ Restaurants Worldwide
                </span>
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
                Elevate Your Restaurant with
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  Smart Digital Menu System
                </span>
              </h1>
              <p className="mb-8 text-xl text-gray-300 md:text-2xl">
                Transform your dining experience with our AI-powered digital menu platform. Increase
                orders by 25% and delight your customers.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  size="lg"
                  className="group relative h-14 overflow-hidden rounded-xl bg-white px-8 shadow-2xl shadow-white/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-main to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 bg-gradient-to-r from-main to-purple-600 bg-clip-text text-lg font-semibold text-transparent group-hover:text-white">
                    Create Your Digital Menu
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 border-gray-400 px-8 text-lg text-white backdrop-blur-xl hover:bg-white/10"
                >
                  View Demo Menu
                </Button>
              </div>

              {/* Floating Stats Cards */}
              <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  icon={<ZapIcon className="size-5" />}
                  stat="25%"
                  label="Order Increase"
                />
                <StatsCard
                  icon={<UsersIcon className="size-5" />}
                  stat="1000+"
                  label="Restaurants"
                />
                <StatsCard icon={<StarIcon className="size-5" />} stat="98%" label="Satisfaction" />
                <StatsCard
                  icon={<CheckIcon className="size-5" />}
                  stat="15min"
                  label="Setup Time"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Trust Badges Section */}
        <section className="border-y border-gray-200 bg-white py-16">
          <Container>
            <div className="text-center">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-main">
                Trusted by Leading Restaurants
              </span>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {/* Add 4-6 grayscale restaurant logos */}
                <div className="h-12 w-32 bg-gray-200 opacity-50" />
                <div className="h-12 w-32 bg-gray-200 opacity-50" />
                <div className="h-12 w-32 bg-gray-200 opacity-50" />
                <div className="h-12 w-32 bg-gray-200 opacity-50" />
              </div>
            </div>
          </Container>
        </section>

        {/* Features Grid Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white/95" />
          <Container className="relative z-10">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-main/10 px-4 py-1.5 text-sm font-semibold text-main">
                Powerful Features
              </span>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                Everything You Need in a Modern <span className="text-main">Digital Menu</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Comprehensive solution with QR ordering, real-time analytics, and seamless POS
                integration
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<QrCodeIcon className="size-8" />}
                title="Smart QR Menus"
                description="Dynamic QR codes that update in real-time with your menu changes and pricing"
                gradient="from-blue-500 to-main"
              />
              <FeatureCard
                icon={<SmartphoneIcon className="size-8" />}
                title="Mobile Ordering"
                description="Seamless mobile ordering experience with customization options"
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureCard
                icon={<BarChartIcon className="size-8" />}
                title="Analytics Dashboard"
                description="Real-time insights into menu performance and customer preferences"
                gradient="from-orange-500 to-yellow-500"
              />
              <FeatureCard
                icon={<PrinterIcon className="size-8" />}
                title="POS Integration"
                description="Works with your existing POS system for seamless order management"
                gradient="from-green-500 to-emerald-500"
              />
              <FeatureCard
                icon={<LayoutDashboardIcon className="size-8" />}
                title="Menu Management"
                description="Easy-to-use dashboard for updating menus, prices, and specials"
                gradient="from-pink-500 to-rose-500"
              />
              <FeatureCard
                icon={<ZapIcon className="size-8" />}
                title="Instant Updates"
                description="Push menu updates instantly across all your digital touchpoints"
                gradient="from-violet-500 to-purple-500"
              />
            </div>
          </Container>
        </section>

        {/* Benefits Section with Image */}
        <section className="bg-zinc-900 py-24 lg:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="absolute -left-4 -top-4 size-72 rounded-full bg-main/30 blur-3xl" />
                <div className="absolute -bottom-8 -right-8 size-72 rounded-full bg-purple-500/30 blur-3xl" />
                <div className="relative rounded-2xl bg-white/10 p-2 backdrop-blur-xl">
                  <Image
                    src="/dashboard-preview.png"
                    width={600}
                    height={400}
                    alt="ByteEat Dashboard Preview"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="relative">
                <span className="mb-4 inline-block rounded-full bg-main/20 px-4 py-1.5 text-sm font-semibold text-main">
                  Why Choose ByteEat
                </span>
                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                  Transform Your Restaurant Operations
                </h2>
                <div className="space-y-6">
                  <BenefitItem
                    title="Increase Revenue"
                    description="Average 25% increase in order value through smart upselling"
                  />
                  <BenefitItem
                    title="Save Time"
                    description="Reduce order processing time by 50% with automated systems"
                  />
                  <BenefitItem
                    title="Enhance Experience"
                    description="Provide a modern dining experience with interactive menus"
                  />
                  <BenefitItem
                    title="Data Insights"
                    description="Make informed decisions with detailed analytics"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 lg:py-32">
          <Container>
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-main/10 px-4 py-1.5 text-sm font-semibold text-main">
                Success Stories
              </span>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Trusted by Leading Restaurants
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                See how restaurants are transforming their business with our digital menu system
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="ByteEat's digital menu system has revolutionized how we handle orders. Our average order value increased by 30%."
                author="Sarah Johnson"
                role="Restaurant Owner"
                image="/testimonial-1.jpg"
              />
              <TestimonialCard
                quote="The analytics helped us optimize our menu. We've seen a significant boost in customer satisfaction."
                author="Michael Chen"
                role="Operations Manager"
                image="/testimonial-2.jpg"
              />
              <TestimonialCard
                quote="Setup was incredibly easy, and the support team is amazing. Best decision we've made for our restaurant."
                author="Lisa Rodriguez"
                role="Restaurant Manager"
                image="/testimonial-3.jpg"
              />
            </div>
          </Container>
        </section>

        {/* Pricing Section */}
        <section className="relative overflow-hidden bg-zinc-900 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <Container className="relative">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block rounded-full bg-main/20 px-4 py-1.5 text-sm font-semibold text-main">
                Simple Pricing
              </span>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Choose Your Digital Menu Plan
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">
                All plans include unlimited menu updates, QR code generation, and 24/7 support
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <PricingCard
                name="Starter"
                price="49"
                description="Perfect for small restaurants"
                features={[
                  "Digital Menu System",
                  "QR Code Generation",
                  "Basic Analytics",
                  "Email Support",
                  "1 Location",
                ]}
                gradient="from-blue-500 to-main"
              />
              <PricingCard
                name="Professional"
                price="99"
                description="Ideal for growing restaurants"
                features={[
                  "Everything in Starter",
                  "Advanced Analytics",
                  "POS Integration",
                  "Priority Support",
                  "3 Locations",
                ]}
                gradient="from-main to-purple-600"
                featured={true}
              />
              <PricingCard
                name="Enterprise"
                price="199"
                description="For restaurant chains"
                features={[
                  "Everything in Professional",
                  "Custom Integrations",
                  "Dedicated Account Manager",
                  "API Access",
                  "Unlimited Locations",
                ]}
                gradient="from-purple-600 to-pink-600"
              />
            </div>
          </Container>
        </section>

        {/* Integration Partners */}
        <section className="py-24">
          <Container>
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full bg-main/10 px-4 py-1.5 text-sm font-semibold text-main">
                Seamless Integration
              </span>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Works With Your Favorite Tools
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
                Integrate with leading POS systems and restaurant management tools
              </p>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                {/* Replace with actual integration partner logos */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-lg"
                  >
                    <div className="h-12 w-24 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-main py-24 lg:py-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-main to-purple-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Join thousands of restaurants already using ByteEat&apos;s digital menu platform.
                Get started with a 14-day free trial.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  size="lg"
                  className="group relative h-14 w-full overflow-hidden rounded-xl bg-white px-8 sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 text-lg font-semibold text-main group-hover:text-white">
                    Start Free Trial
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full border-white px-8 text-lg text-white hover:bg-white/10 sm:w-auto"
                >
                  Schedule Demo
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/80">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <Container>
          <div className="py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Image src="/logo.png" width={120} height={40} alt="ByteEat" className="mb-6" />
                <p className="text-gray-600">
                  Transforming restaurants with smart digital menu solutions.
                </p>
              </div>
              <FooterLinks
                title="Product"
                links={[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Integration", href: "#integration" },
                  { label: "Documentation", href: "#docs" },
                ]}
              />
              <FooterLinks
                title="Company"
                links={[
                  { label: "About Us", href: "#about" },
                  { label: "Blog", href: "#blog" },
                  { label: "Careers", href: "#careers" },
                  { label: "Contact", href: "#contact" },
                ]}
              />
              <FooterLinks
                title="Legal"
                links={[
                  { label: "Privacy Policy", href: "#privacy" },
                  { label: "Terms of Service", href: "#terms" },
                  { label: "Cookie Policy", href: "#cookies" },
                ]}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 py-6">
            <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 md:flex-row md:space-y-0">
              <div>© 2024 ByteEat. All rights reserved.</div>
              <div className="flex space-x-6">
                <Link href="#" className="hover:text-main">
                  Twitter
                </Link>
                <Link href="#" className="hover:text-main">
                  LinkedIn
                </Link>
                <Link href="#" className="hover:text-main">
                  Facebook
                </Link>
                <Link href="#" className="hover:text-main">
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}

// Supporting Components
function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group relative rounded-2xl bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-r ${gradient} p-3 text-white`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`}
      />
    </div>
  )
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="rounded-full bg-main/20 p-2">
        <CheckIcon className="size-6 text-main" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  image,
}: {
  quote: string
  author: string
  role: string
  image: string
}) {
  return (
    <div className="relative rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-6">
        <StarIcon className="size-6 text-yellow-400" />
        <StarIcon className="size-6 text-yellow-400" />
        <StarIcon className="size-6 text-yellow-400" />
        <StarIcon className="size-6 text-yellow-400" />
        <StarIcon className="size-6 text-yellow-400" />
      </div>
      <blockquote className="mb-6 text-gray-600">{quote}</blockquote>
      <div className="flex items-center space-x-4">
        <Image src={image} width={48} height={48} alt={author} className="rounded-full" />
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}

// Additional Supporting Components
function PricingCard({
  name,
  price,
  description,
  features,
  gradient,
  featured = false,
}: {
  name: string
  price: string
  description: string
  features: string[]
  gradient: string
  featured?: boolean
}) {
  return (
    <div
      className={`relative rounded-2xl ${
        featured ? "scale-105 bg-white shadow-xl" : "bg-white/10 backdrop-blur-xl"
      } p-8 transition-transform hover:-translate-y-1`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-main px-4 py-1 text-sm font-semibold text-white">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${featured ? "text-gray-900" : "text-white"}`}>{name}</h3>
        <p className={`mt-2 ${featured ? "text-gray-600" : "text-gray-400"}`}>{description}</p>
      </div>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${featured ? "text-gray-900" : "text-white"}`}>
          ${price}
        </span>
        <span className={`text-sm ${featured ? "text-gray-600" : "text-gray-400"}`}>/month</span>
      </div>
      <ul className="mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className={`mr-3 size-5 ${featured ? "text-main" : "text-white"}`} />
            <span className={featured ? "text-gray-600" : "text-gray-300"}>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${
          featured
            ? "bg-gradient-to-r from-main to-purple-600 text-white hover:from-main/90 hover:to-purple-600/90"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Get Started
      </Button>
    </div>
  )
}

function FooterLinks({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-4 font-semibold">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-gray-600 transition-colors hover:text-main"
              prefetch={false}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatsCard({ icon, stat, label }: { icon: React.ReactNode; stat: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-6 backdrop-blur-xl">
      <div className="mb-3 inline-flex rounded-lg bg-white/10 p-2 text-white">{icon}</div>
      <div className="text-2xl font-bold text-white">{stat}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  )
}
