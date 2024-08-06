import { NextRequest, NextResponse } from "next/server"

import { parseSlug } from "./lib/utils"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Handle specific redirects
  if (url.pathname === "/manage/orders") {
    url.pathname = "/manage/orders/current"
    return NextResponse.redirect(url)
  }

  // Skip middleware for these paths
  if (
    url.pathname === "/" ||
    url.pathname.startsWith("/manage") ||
    url.pathname.startsWith("/about") ||
    url.pathname.startsWith("/privacy") ||
    url.pathname.endsWith("/subscription-expired")
  ) {
    return NextResponse.next()
  }

  const slug = parseSlug(url.pathname)
  if (slug) {
    const subscriptionCheckUrl = new URL(`/api/check-subscription`, request.url)
    subscriptionCheckUrl.searchParams.set("slug", slug)
    try {
      const response = await fetch(subscriptionCheckUrl.toString(), {
        method: "GET",
        headers: {
          "X-Middleware-Request": "true",
        },
      })

      if (response.status === 404) {
        return NextResponse.next()
      } else if (!response.ok) {
        return NextResponse.redirect(
          new URL(`/${slug}/subscription-expired`, request.url)
        )
      }
    } catch (error) {
      console.error("Error checking subscription:", error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
