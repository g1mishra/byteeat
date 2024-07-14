import { useEffect, useState } from "react"
import Image from "next/image"

import { Label } from "@/components/ui/label"

const MAX_IMAGES = 3

export default function UploadItemImage({
  uploadItemImage,
  imagesRef,
}: {
  uploadItemImage: string
  imagesRef?: React.MutableRefObject<(File | string)[]>
}) {
  const [images, setImages] = useState<(File | string)[]>([])

  useEffect(() => {
    if (!uploadItemImage) return
    const splitedImages = uploadItemImage.split(";")
    if (splitedImages.length > 0) {
      setImages(splitedImages)
      if (imagesRef) {
        imagesRef.current = splitedImages
      }
    }
  }, [imagesRef, uploadItemImage])

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages.splice(index, 1)
      if (imagesRef) {
        imagesRef.current = newImages
      }
      return newImages
    })
  }

  return (
    <div className="grid gap-2">
      <Label>Images</Label>
      <div className="grid grid-cols-3 gap-2">
        {images.length < MAX_IMAGES && (
          <>
            <button
              type="button"
              className="bg-muted relative flex aspect-square items-center justify-center rounded-md border border-dashed"
            >
              <PlusIcon className="text-muted-foreground size-6" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    const newImages = Array.from(files).slice(0, MAX_IMAGES)
                    setImages((prev) => {
                      const updatedImages = [...prev, ...newImages]
                      if (imagesRef) {
                        imagesRef.current = updatedImages
                      }
                      return updatedImages
                    })
                  }
                }}
              />
            </button>
          </>
        )}

        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="Image 1"
              fill
              className="object-cover"
            />
            <button
              type="button"
              className="bg-background/80 hover:bg-background absolute right-2 top-2 rounded-full p-1"
            >
              <XIcon
                className="text-destructive size-4"
                onClick={() => handleRemoveImage(index)}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
