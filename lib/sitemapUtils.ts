// lib/sitemapUtils.ts
import prisma from "@/lib/prisma"

const BASE_URL = "https://www.byteeat.in"

export async function generateSitemaps() {
  const restaurantCount = await prisma.restaurant.count()
  const sitemapsNeeded = Math.ceil(restaurantCount / 50000)
  const sitemaps = Array.from({ length: sitemapsNeeded }, (_, index) => ({
    id: index,
    url: `${BASE_URL}/restaurant/sitemap/${index}.xml`,
  }))

  return sitemaps
}

export async function buildSitemapIndex(sitemaps: string[]) {
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
