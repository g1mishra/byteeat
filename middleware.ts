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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|service-worker.js|worker-sentry.js).*)",
  ],
}
