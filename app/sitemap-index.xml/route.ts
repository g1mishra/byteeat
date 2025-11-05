// app/sitemap-index/route.ts
import { buildSitemapIndex, generateSitemaps } from "@/lib/sitemapUtils"
import { NextResponse } from "next/server"

const BASE_URL = "https://byteeat.vercel.app"

export async function GET() {
  try {
    const dynamicSitemaps = await generateSitemaps()

    const sitemaps = [`${BASE_URL}/sitemap.xml`, ...dynamicSitemaps.map((sitemap) => sitemap.url)]

    const sitemapIndexXML = await buildSitemapIndex(sitemaps)

    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    })
  } catch (error) {
    console.error("Error generating sitemap index:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
