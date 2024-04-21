"use client"

import React, { useState } from "react"
import Image from "next/image"
import { FilePenLine, PlusCircle, X } from "lucide-react"

type Props = {
  folderName: string
  btnRef: React.RefObject<HTMLButtonElement>
  imgSrc: string
}

export default function UploadLogo({ folderName, btnRef, imgSrc }: Props) {
  const [file, setFile] = useState<File>()
  const inputRef = React.createRef<HTMLInputElement>()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files != null) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file && file.name != null) {
      const formData = new FormData()
      formData.append("slug", folderName)
      formData.append("file", file)

      fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="my-3 flex aspect-video w-full max-w-52  items-center"
    >
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        accept="image/*"
        onInput={handleChange}
      />
      <div className="relative flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 ">
        {imgSrc && !file ? (
          <>
            <Image
              src={imgSrc}
              alt="Restaurant Logo"
              width={208}
              height={208}
              className="size-full rounded-lg object-contain"
            />
            <FilePenLine
              className="absolute right-2 top-2 cursor-pointer rounded-full bg-white p-1 text-gray-500"
              onClick={() => inputRef.current?.click()}
            />
          </>
        ) : file ? (
          <>
            <Image
              src={URL.createObjectURL(file)}
              alt="Restaurant Logo"
              width={208}
              height={208}
              className="size-full rounded-lg object-contain"
              onClick={() => inputRef.current?.click()}
            />
            <X
              className="absolute right-2 top-2 cursor-pointer rounded-full bg-white p-1 text-gray-500"
              onClick={() => setFile(undefined)}
            />
          </>
        ) : (
          <PlusCircle className="mx-12 my-8" onClick={() => inputRef.current?.click()} />
        )}
      </div>
      <button type="submit" className="hidden" ref={btnRef}>
        Upload
      </button>
    </form>
  )
}
