import React, { useCallback, useEffect } from "react"
import { createPortal } from "react-dom"

const CenterLoading: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)

  const preventAllEvents = useCallback((e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  useEffect(() => {
    setMounted(true)

    const eventTypes = [
      "keydown",
      "keyup",
      "keypress",
      "mousedown",
      "mouseup",
      "click",
      "dblclick",
      "mousemove",
      "wheel",
    ]
    eventTypes.forEach((type) => window.addEventListener(type, preventAllEvents, { capture: true }))

    return () => {
      setMounted(false)
      eventTypes.forEach((type) =>
        window.removeEventListener(type, preventAllEvents, { capture: true })
      )
    }
  }, [preventAllEvents])

  const loadingOverlay = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50"
      style={{
        pointerEvents: "all",
      }}
    >
      <div className="loader size-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
    </div>
  )

  return mounted ? createPortal(loadingOverlay, document.body) : null
}

export default CenterLoading
