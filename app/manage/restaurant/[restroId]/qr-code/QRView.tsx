"use client"

import { useState } from "react"
import { useQRCode } from "next-qrcode"

function QRMenu({
  totalTables = 0,
  slug,
}: {
  totalTables?: number
  slug: string
}) {
  const { Canvas } = useQRCode()
  const [tableNo, setTableNo] = useState(1)
  const root_url =
    typeof window !== "undefined" ? window.location.origin : "localhost:3000"

  const url_to_render = `${root_url}/${slug}${
    tableNo > 0 ? `?tableNumber=${tableNo}` : ""
  }`

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Select Table Number</h2>
      <select
        name="table_no"
        id="table_no"
        onChange={(e) => setTableNo(Number(e.target.value))}
        className="mb-6 rounded-lg border bg-white p-2 text-black shadow-md"
        value={tableNo}
      >
        {Array.from({ length: totalTables }, (_, i) => i + 1).map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>
      <Canvas
        text={url_to_render}
        options={{
          errorCorrectionLevel: "M",
          margin: 4,
          scale: 5,
          width: 250,
          color: {
            dark: "#333333",
            light: "#FFFFFF",
          },
        }}
      />
      <p className="mt-4 text-lg font-medium">Table number: {tableNo}</p>
    </div>
  )
}

export default QRMenu
