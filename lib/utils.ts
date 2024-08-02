import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
