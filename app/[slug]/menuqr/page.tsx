"use client"

import { useQRCode } from "next-qrcode"
import { useEffect, useState } from "react"
import { getRestaurantIdBySlug } from "@/services/restaurantService"
import { number } from "zod"



function QRMenu({ params }: any) {
  const { Canvas } = useQRCode()
  let root_url = "localhost:3000"

  if (typeof window !== "undefined") {
    root_url = window.location.origin
  }

  const [totalTables, setTotalTables] = useState(0);

  useEffect(() => {
    const fetchTotalTables = async () => {
      try {
        const restaurantIds = await getRestaurantIdBySlug(params.slug);
        setTotalTables(restaurantIds?.tableSize as number);
      } catch (error) {
        console.error("Error fetching total tables:", error);
      }
    };

    fetchTotalTables();
  }, [params.slug]);
  console.log(totalTables)

  const [tableNo, setTableNo] = useState(1)
  const url_to_render = tableNo<1?`${root_url}/${params.slug}`:`${root_url}/${params.slug}?tableNumber=${tableNo}`
  

  return (
    <div className="flex flex-col h-screen justify-center items-center">
     <h2>Select table Number</h2>
      <select name="table_no" id="table_no" onChange={(e) => setTableNo(Number(e.target.value))} className="text-black">
         {
          Array.from({length: totalTables}, (_, i) => i + 1).map((table) => (
            <option key={table} value={table} >{table}</option>
          ))
         }

      </select>
      <Canvas
        text={url_to_render}
        options={{
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 200,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        }}
      />
      <p>Table number: {tableNo}</p>
    </div>
  )
}

export default QRMenu
