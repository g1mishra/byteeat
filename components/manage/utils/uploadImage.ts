async function uploadImage(file: File | undefined | null, slug: string) {
  if (!file) {
    return null
  }
  const formData = new FormData()
  formData.append("file", file as Blob)
  formData.append("slug", slug)

  try {
    const response = await fetch("/api/image-upload", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      return data.url
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export default uploadImage
