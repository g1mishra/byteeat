export const fromatDate = (createdAt: Date) => {
  const date = new Date(createdAt)

  const localDateString = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const localTimeString = date.toLocaleTimeString() // e.g., "12:34 PM"

  return `${localDateString} at ${localTimeString}`
}

export const getStartAndEndOfDay = (timestamp: string) => {
  const utcTimestamp = new Date(timestamp)

  // Get UTC year, month, and day
  const year = utcTimestamp.getUTCFullYear()
  const month = utcTimestamp.getUTCMonth()
  const day = utcTimestamp.getUTCDate()

  // Create start and end of the day in UTC
  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999))

  return { startOfDay, endOfDay }
}
