import { useEffect, useState } from "react"

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window?.matchMedia(query)?.matches
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener("change", handleChange)

    return () => {
      mediaQueryList.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export default useMediaQuery
