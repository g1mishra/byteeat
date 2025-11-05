import cloudinary from "@/lib/aws-s3-client"
import { UploadApiResponse } from "cloudinary"
import { NextResponse } from "next/server"
import sharp from "sharp"

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
      return NextResponse.json({ error: "Error resizing image" }, { status: 500 })
    }
  }

  try {
    // Convert buffer to base64 for Cloudinary upload
    const base64Image = `data:${file.type};base64,${(resized || filebuffer).toString("base64")}`

    // Upload to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(base64Image, {
      folder: `byteeat/${slug}`,
      public_id: file.name.split(".")[0],
      resource_type: "auto",
    })

    const url = result.secure_url

    if (!url) {
      return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading file: ", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}
