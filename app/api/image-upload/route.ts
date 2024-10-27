import { NextResponse } from "next/server"
import sharp from "sharp"

import s3 from "@/lib/aws-s3-client"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const slug = formData.get("slug")
  const resize = formData.get("resize") === "true"

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }
  if (!slug) {
    return NextResponse.json({ error: "No slug received." }, { status: 400 })
  }

  const filebuffer = Buffer.from(await file.arrayBuffer())

  let resized: Buffer | undefined = undefined

  if (resize) {
    try {
      resized = await sharp(filebuffer).resize(500, 500).toBuffer()
    } catch (error) {
      console.error("Error resizing image: ", error)
      return NextResponse.json(
        { error: "Error resizing image" },
        { status: 500 }
      )
    }
  }

  try {
    const params = {
      Bucket: "byte-eat-staticfiles",
      Key: `${slug}/${file.name}`,
      Body: resized || filebuffer,
    }
    const resp = await s3.upload(params).promise()
    const url = resp.Location

    if (!url) {
      return NextResponse.json(
        { error: "Error uploading file" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading file: ", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}
