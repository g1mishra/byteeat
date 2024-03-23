"use client"

import React, { useEffect, useState } from "react"

function AnimatingEmoji() {
  const emojis = ["🍔", "🍕", "🥂", "🎂"]
  const [index, setIndex] = useState(0)

  // Use effect to cycle through emojis every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % emojis.length)
    }, 1000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array to run effect only once on mount

  return <span className="emoji">{emojis[index]}</span>
}

export default AnimatingEmoji
