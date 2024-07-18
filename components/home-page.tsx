import { JSX, SVGProps } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import Features from "./icons/features"
import SVGComponent from "./icons/hero"

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container  flex h-14 items-center px-4 lg:px-6">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <BinaryIcon className="size-6" />
          <span className="text-2xl font-bold">ByteEat</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Testimonials
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="flex min-h-[65vh] w-full items-center  py-12 md:py-24 lg:py-32">
          <div className="container flex size-full flex-col items-center justify-center px-4 md:px-6">
            {/* <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"> */}
            <div className="flex max-w-screen-lg flex-col items-center justify-center space-y-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none">
                  Revolutionize Your Restaurant Experience with ByteEat
                </h1>
                <p className="text-muted-foreground max-w-screen-sm md:text-xl">
                  Discover the power of digital menus and table QR-based
                  ordering with ByteEat, the ultimate solution for modern
                  restaurants.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/manage"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-8 py-2.5 text-lg font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
            {/* </div> */}
          </div>
        </section>
        <section
          id="features"
          className="bg-muted w-full py-12 md:pt-24"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Discover the Power of ByteEat
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ByteEat offers a comprehensive suite of features to enhance
                  your restaurant&apos;s operations and customer experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Digital Menu</h3>
                      <p className="text-muted-foreground">
                        Showcase your menu with high-quality food images and
                        detailed descriptions, making it easy for customers to
                        browse and order.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Table QR-based Ordering
                      </h3>
                      <p className="text-muted-foreground">
                        Empower your customers to order directly from their
                        phones, reducing wait times and improving efficiency.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Real-time Order Tracking
                      </h3>
                      <p className="text-muted-foreground">
                        Keep your customers informed about the status of their
                        orders, ensuring a seamless dining experience.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <Features className="w-full overflow-hidden rounded-xl object-cover object-center lg:order-last" />
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="bg-muted w-full pb-12"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Pricing
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our flexible pricing options to fit your
                  restaurant&apos;s needs.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="bg-background flex flex-col justify-center space-y-4 rounded-lg p-6 shadow-md">
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Starter</h3>
                    <p className="text-muted-foreground">
                      Perfect for small restaurants
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <h4 className="text-4xl font-bold">$49</h4>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                  <ul className="text-muted-foreground grid gap-2">
                    <li>Digital Menu</li>
                    <li>Table QR-based Ordering</li>
                    <li>Basic Reporting</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </div>
                <div className="bg-background flex flex-col justify-center space-y-4 rounded-lg p-6 shadow-md">
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Pro</h3>
                    <p className="text-muted-foreground">
                      Ideal for medium-sized restaurants
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <h4 className="text-4xl font-bold">$99</h4>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                  <ul className="text-muted-foreground grid gap-2">
                    <li>Digital Menu</li>
                    <li>Table QR-based Ordering</li>
                    <li>Real-time Order Tracking</li>
                    <li>Advanced Reporting</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </div>
                <div className="bg-background flex flex-col justify-center space-y-4 rounded-lg p-6 shadow-md">
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Enterprise</h3>
                    <p className="text-muted-foreground">
                      Tailored for large restaurant chains
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <h4 className="text-4xl font-bold">$199</h4>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                  <ul className="text-muted-foreground grid gap-2">
                    <li>Digital Menu</li>
                    <li>Table QR-based Ordering</li>
                    <li>Real-time Order Tracking</li>
                    <li>Advanced Reporting</li>
                    <li>Customized Branding</li>
                    <li>Dedicated Support</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Customers Say
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from restaurant owners and customers who have experienced
                  the benefits of ByteEat.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">
                      &quot;ByteEat has transformed our restaurant
                      operations!&quot;
                    </h3>
                    <p className="text-muted-foreground">
                      - John Doe, Owner, The Bistro
                    </p>
                    <p className="text-muted-foreground">
                      &quot;The digital menu and table QR-based ordering have
                      streamlined our workflow and improved customer
                      satisfaction. We highly recommend ByteEat to any
                      restaurant looking to modernize their operations.&quot;
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">
                      &quot;ByteEat has made dining at our restaurant a
                      breeze!&quot;
                    </h3>
                    <p className="text-muted-foreground">
                      - Jane Smith, Customer
                    </p>
                    <p className="text-muted-foreground">
                      &quot;The ability to order directly from my phone and
                      track the status of my order has greatly improved my
                      dining experience. ByteEat is a game-changer for
                      restaurants!&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <div className="flex items-center">
          <BinaryIcon className="mr-2 size-6" />
          <span className="text-sm">ByteEat</span>
        </div>
        <p className="text-muted-foreground ml-auto text-xs">
          &copy; 2024 ByteEat. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            href="/about"
            className="text-xs underline-offset-4 hover:underline"
            prefetch={false}
          >
            About
          </Link>

          <Link
            href="/privacy"
            className="text-xs underline-offset-4 hover:underline"
            prefetch={false}
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
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
