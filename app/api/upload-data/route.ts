import { NextResponse } from "next/server"

// import { insertData } from "@/temp/data-upload"

export async function GET(request: Request, context: any) {
  try {
    // const data = await insertData()
    // return NextResponse.json({ data })
    return NextResponse.json({ data: "GET" })
  } catch (error) {
    console.error("Error uploading data: ", error)
    return NextResponse.json({ error: "Error uploading data" }, { status: 500 })
  }
}
