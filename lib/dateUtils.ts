export const fromatDate = (createdAt: Date) => {
  const date = new Date(createdAt)

  const localDateString = date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )
  const localTimeString = date.toLocaleTimeString() // e.g., "12:34 PM"

  return `${localDateString} at ${localTimeString}`
}
