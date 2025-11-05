import { fetchRestaurantSubscriptionStatus } from "@/services/restaurantService"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }
    const subscriptionStatus = await fetchRestaurantSubscriptionStatus(slug)
    return NextResponse.json(subscriptionStatus)
  } catch (error) {
    console.error("Error validating slug:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
