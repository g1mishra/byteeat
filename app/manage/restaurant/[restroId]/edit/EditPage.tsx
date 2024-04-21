"use client"

import React from "react"
import { Restaurant } from "@prisma/client"

import { Button } from "@/components/ui/button"
import UploadLogo from "@/components/upload_logo"

const EditPage = ({ response }: { response: Restaurant }) => {
  const btnRef = React.createRef<HTMLButtonElement>()

  const handleSave = () => {
    console.log("save")
    btnRef.current?.click()
  }

  return (
    <>
      <UploadLogo
        folderName={response?.slug}
        btnRef={btnRef}
        imgSrc={response?.logoUrl|| ""}
      />
      <Button onClick={handleSave}>Save</Button>
    </>
  )
}

export default EditPage
