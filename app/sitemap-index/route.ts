import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

const BASE_URL = process.env.NEXT_WEBSITE_URL || "https://byteeat.in"

export async function generateSitemaps() {
  const restaurantCount = await prisma.restaurant.count()
  const sitemapsNeeded = Math.ceil(restaurantCount / 50000)
  const sitemaps = Array.from({ length: sitemapsNeeded }, (_, index) => ({
    id: index,
    url: `${BASE_URL}/restaurant/sitemap/${index}.xml`,
  }))

  return sitemaps
}

export async function GET() {
  try {
    const dynamicSitemaps = await generateSitemaps()

    const sitemaps = [
      `${BASE_URL}/sitemap.xml`,
      ...dynamicSitemaps.map((sitemap) => sitemap.url),
    ]

    const sitemapIndexXML = await buildSitemapIndex(sitemaps)

    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    })
  } catch (error) {
    console.error("Error generating sitemap index:", error)
    return NextResponse.error()
  }
}

async function buildSitemapIndex(sitemaps: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  for (const sitemapURL of sitemaps) {
    xml += "<sitemap>"
    xml += `<loc>${sitemapURL}</loc>`
    xml += "</sitemap>"
  }

  xml += "</sitemapindex>"
  return xml
}
