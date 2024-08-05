import { NextRequest, NextResponse } from "next/server"
import { fetchRestaurantSubscriptionStatus } from "@/services/restaurantService"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  try {
    const subscriptionStatus = await fetchRestaurantSubscriptionStatus(slug)

    if (subscriptionStatus.isActive) {
      return NextResponse.json({ isActive: true }, { status: 200 })
    } else {
      return NextResponse.json(
        { isActive: false, message: subscriptionStatus.message },
        { status: 403 }
      )
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }
    console.error("Error checking subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
