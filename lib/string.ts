import { FullAdress } from "@/services/restaurantService"

export function formatAddress(response: FullAdress) {
  const { address_string, city, state, country } = response

  const parts = new Set<string>(
    address_string
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  )

  if (city) parts.add(city)
  if (state) parts.add(state)
  if (country) parts.add(country)

  return Array.from(parts).join(", ")
}

export function Slugify(text = "") {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function avatarName(name: string) {
  if (!name) return ""

  return name
    .split(" ")
    .filter((n) => n.trim() !== "")
    .slice(0, 3)
    .map((n) => n[0]?.toUpperCase())
    .join("")
}
