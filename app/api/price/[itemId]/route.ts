import { NextResponse } from "next/server"
import { fetchPrice } from "@/services/menuService"

export async function GET(request: Request, context: any) {
  const params = context["params"]
  const itemId = params["itemId"]
  const prices = await fetchPrice(itemId)

  return NextResponse.json(prices)
}
