import { NextRequest, NextResponse } from "next/server"

import { getBasePath } from "./lib/utils"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { hostname, pathname } = url
  const host = request.headers.get("host") || hostname

  const subdomain = host?.split(".")[0]
  const isSubdomain = host?.includes(".") && subdomain !== "www"

  const allowedDomains = ["byteeat.in", "localhost"]
  const isAllowedDomain = allowedDomains.some((domain) => host.includes(domain))

  console.log(
    "before",
    JSON.stringify({ url, isSubdomain, subdomain, host, pathname, isAllowedDomain }, null, 2)
  )

  if (isSubdomain && isAllowedDomain) {
    url.pathname = `/restaurant/${subdomain}${pathname}`
    console.log(
      "after",
      JSON.stringify({ url, isSubdomain, subdomain, host, pathname, isAllowedDomain }, null, 2)
    )
    return NextResponse.rewrite(url)
  }

  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] === "restaurant" && segments.length > 1 && isAllowedDomain) {
    const potentialSlug = segments[1]

    if (!potentialSlug) {
      return NextResponse.redirect(new URL("/", request.url))
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

      const data = await response.json()

      if (data?.isValid) {
        if (!data?.isActive) {
          return NextResponse.redirect(`${getBasePath(potentialSlug)}/subscription-expired`)
        }

        const newPath = pathname.replace(`/${segments[0]}/${segments[1]}`, "")

        return NextResponse.redirect(`${getBasePath(potentialSlug)}${newPath}${url.search}`)
      }
    } catch (error) {
      console.error("Error validating slug:", error)
    }

    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo*|robots.txt|service-worker.js).*)"],
}
