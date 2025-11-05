import prisma from "@/lib/prisma"
import { getBasePath } from "@/lib/utils"
import type { MetadataRoute } from "next"

const BASE_URL = "https://byteeat.vercel.app"

export async function generateSitemaps() {
  const restaurantCount = await prisma.restaurant.count()
  const sitemapsNeeded = Math.ceil(restaurantCount / 50000)
  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
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
    url: getBasePath(restaurant.slug),
    lastModified: restaurant.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return dynamicEntries || []
}
