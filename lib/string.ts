import { FullAdress } from "@/services/restaurantService"

export function formatAddress(response: FullAdress) {
  return [
    response?.address_string,
    response?.city,
    response?.state,
    response?.country,
  ]
    .filter(Boolean)
    .join(", ")
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
