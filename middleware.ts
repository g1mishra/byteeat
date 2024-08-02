import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.pathname === "/manage/orders") {
    url.pathname = "/manage/orders/current"
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/manage/orders"],
}
