import { insertData } from "@/temp/data-upload"
import { NextResponse } from "next/server"


export async function GET(request: Request, context: any) {
  try {
    const restaurantId = new URL(request.url).searchParams.get("restaurantId")
    const data = await insertData(restaurantId || "")
    return NextResponse.json({ data })
    // return NextResponse.json({ data: "GET" })
  } catch (error) {
    console.error("Error uploading data: ", error)
    return NextResponse.json({ error: "Error uploading data" }, { status: 500 })
  }
}
