import { Subscription, SubscriptionStatus } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const SLUG_PATTERNS = [
  /^\/([^\/]+)\/?$/, // Matches '/slug' or '/slug/'
  /^\/([^\/]+)\/view-cart\/?$/, // Matches '/slug/view-cart' or '/slug/view-cart/'
  /^\/([^\/]+)\/[^\/]+\/?$/, // Matches '/slug/anything' or '/slug/anything/'
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any) => any>(
  func: T,
  waitFor: number
) {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), waitFor)
  }
}

export const getPathWithQuery = (href: string): string => {
  if (typeof window === "undefined") return href
  const searchParams = new URLSearchParams(window.location.search)
  let url: URL

  if (href.startsWith("http")) {
    url = new URL(href)
  } else {
    url = new URL(href, window.location.origin)
  }

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  return url.pathname + url.search
}

export function utcToIst(utcDate: Date): Date {
  return new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000)
}

export const checkSubscriptionStatus = (subscription: Subscription | null) => {
  if (!subscription) return false
  const now = new Date()

  if (subscription.status !== SubscriptionStatus.ACTIVE) return false

  if (subscription.freeTrialEndDate && now > subscription.freeTrialEndDate) {
    // Free trial has ended
    return false
  }

  if (subscription.endDate && now > subscription.endDate) {
    // Paid subscription has ended
    return false
  }

  return true
}

export function parseSlug(pathname: string): string | null {
  for (const pattern of SLUG_PATTERNS) {
    const match = pathname.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  return null
}
