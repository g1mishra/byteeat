import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { fetchRestaurantSubscriptionStatus } from "@/services/restaurantService"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { HomeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SubscriptionExpiredPage = async ({ params: { slug } }: any) => {
  let subscriptionStatus = { isActive: false }
  try {
    subscriptionStatus = await fetchRestaurantSubscriptionStatus(slug)
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return notFound()
    }
    console.error("Error checking subscription:", error)
  }

  if (subscriptionStatus.isActive) {
    return redirect(`/${slug}`)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-red-600">
            <ExclamationTriangleIcon className="size-6" />
            Subscription Expired
          </CardTitle>
          <CardDescription>
            The restaurant you&apos;re trying to access is currently
            unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            We apologize for the inconvenience. The restaurant&apos;s
            subscription has expired, and they are unable to display their menu
            at this time.
          </p>
          <p className="text-sm text-gray-600">
            If you&apos;re the restaurant owner, please renew your subscription
            to restore access to your digital menu.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <HomeIcon size={16} />
              Return to Homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SubscriptionExpiredPage
