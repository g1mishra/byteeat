import type { MetadataRoute } from "next"

import prisma from "@/lib/prisma"

const BASE_URL = "https://byteeat.in"

export async function generateSitemaps() {
  const restaurantCount = await prisma.restaurant.count()
  const sitemapsNeeded = Math.ceil(restaurantCount / 50000)
  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const end = start + 50000

  // Fetch the restaurants from the database
  const restaurants = await prisma.restaurant.findMany({
    skip: start,
    take: end - start,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Create the sitemap entries
  const dynamicEntries = restaurants.map((restaurant) => ({
    url: `${BASE_URL}/restaurant/${restaurant.slug}`,
    lastModified: restaurant.updatedAt,
  }))

  // Static pages entries
  const staticEntries = [
    { url: `${BASE_URL}`, lastModified: new Date() },
    { url: `${BASE_URL}/#pricing`, lastModified: new Date() },
    { url: `${BASE_URL}/#features`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy`, lastModified: new Date() },
  ]

  return [...staticEntries, ...dynamicEntries]
}
