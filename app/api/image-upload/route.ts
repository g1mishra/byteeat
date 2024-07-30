import { NextResponse } from "next/server"

import s3 from "@/lib/aws-s3-client"

const sharp = require("sharp")

export async function POST(request: Request) {
  const formData = await request.formData()

  
  const file = formData.get("file") as File
  let resized = undefined
  if(file) {
  const filebuffer = Buffer.from(await file.arrayBuffer())
  
  resized = await sharp(filebuffer)
    .resize(500, 500)
    .toBuffer()

  }
  
  const slug = formData.get("slug")
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }
  if (!slug) {
    return NextResponse.json({ error: "No slug received." }, { status: 400 })
  }

  try {
    const params = {
      Bucket: "byte-eat-staticfiles",
      Key: `${slug}`,
      Body: file?resized:undefined,
    }
    const resp = await s3.upload(params).promise()
    const url = resp.Location
    if (!url) {
      return NextResponse.json(
        { error: "Error uploading file" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url,
    })
  } catch (error) {
    console.error("Error uploading file: ", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}
