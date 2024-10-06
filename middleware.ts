import { NextRequest, NextResponse } from "next/server"

import { BaseDomain, getBasePath } from "./lib/utils"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get("host")
  const subdomain = host?.split(".")[0]
  const pathname = url.pathname

  const potentialSlug = subdomain?.replace(`${BaseDomain}`, "")

  if (!potentialSlug) {
    console.log("No potential slug", { host, subdomain, pathname, potentialSlug })
    return NextResponse.next()
  }

  try {
    const basePath = getBasePath()
    const response = await fetch(`${basePath}/api/validate-slug`, {
      method: "POST",
      body: JSON.stringify({ slug: potentialSlug }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const restaurant = await response.json()

    if (!restaurant?.isValid) {
      console.log("Invalid slug", { host, subdomain, pathname, potentialSlug })
      return NextResponse.next()
    }

    if (!restaurant?.isActive && !pathname.includes("subscription-expired")) {
      return NextResponse.redirect(`${getBasePath(potentialSlug)}/subscription-expired`)
    }

    return NextResponse.rewrite(new URL(`${potentialSlug}${pathname}${url.search}`, request.url))
  } catch (error) {
    console.error("Error validating slug:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo*|robots.txt|service-worker.js).*)"],
}
