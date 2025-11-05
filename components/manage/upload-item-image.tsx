import Image from "next/image"
import { useEffect, useState } from "react"

export default function UploadItemImage({
  uploadItemImage,
  imageRef,
}: {
  uploadItemImage: string
  imageRef: React.MutableRefObject<File | string | null>
}) {
  const [image, setImage] = useState<File | string | null>(null)

  useEffect(() => {
    if (uploadItemImage) {
      setImage(uploadItemImage)
      imageRef.current = uploadItemImage
    }
  }, [imageRef, uploadItemImage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      imageRef.current = file
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    imageRef.current = null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-24 overflow-hidden rounded-lg shadow-md">
        {image ? (
          <>
            <Image
              src={typeof image === "string" ? image : URL.createObjectURL(image)}
              alt="Menu item"
              fill
              className="object-contain transition-transform hover:scale-105"
            />
            <button
              type="button"
              className="absolute -right-1 -top-1 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
              onClick={handleRemoveImage}
            >
              <XIcon className="size-4 text-red-500" />
            </button>
          </>
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-100 transition-colors hover:bg-gray-200">
            <label className="cursor-pointer text-center">
              <PlusIcon className="mx-auto mb-1 size-8 text-gray-400" />
              <span className="text-sm text-gray-500">Add Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        )}
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
