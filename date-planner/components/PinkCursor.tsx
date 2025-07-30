"use client"

import React, { useEffect, useState } from "react"

export default function PinkCursor() {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <style>{`html, body, *{ cursor: none !important; }`}</style>
      <div
        style={{
          position: "fixed",
          left: cursorPos.x - 10,
          top: cursorPos.y - 10,
          width: 20,
          height: 20,
          background: "#fbb6ce",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 100,
          boxShadow: "0 2px 8px 0 #fbb6ce55",
          transition: "left 0.05s, top 0.05s",
        }}
      />
    </>
  )
}
