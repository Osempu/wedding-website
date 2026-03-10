import { useEffect, useState } from "react"
import Masonry from "../components/Components/Masonry/Masonry"
import FileUpload from "../../components/comp-547"
import { listFiles } from "@/lib/storage"

type GalleryItem = {
  id: string
  img: string
  url: string
  height: number
}

function generateRandomPhotos(
  count: number
): Array<GalleryItem> {
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    img: `https://picsum.photos/id/${Math.floor(
      Math.random() * 1000
    )}/600/900?grayscale`,
    url: `https://example.com/photo${i + 1}`,
    height: Math.floor(Math.random() * 500) + 200, // height between 200 and 700
  }))
}

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(generateRandomPhotos(20))
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")

  // Fetch uploaded images from Supabase on mount
  useEffect(() => {
    loadGalleryImages()
  }, [])

  const loadGalleryImages = async () => {
    setIsLoading(true)
    try {
      const { files, error } = await listFiles()
      
      if (error) {
        console.error("Failed to load gallery images:", error)
        return
      }

      // Convert Supabase files to gallery items
      const uploadedItems: GalleryItem[] = files.map((file) => ({
        id: `uploaded-${file.name}`,
        img: file.url,
        url: file.url,
        height: Math.floor(Math.random() * 500) + 200,
      }))

      // Prepend uploaded images to the gallery
      if (uploadedItems.length > 0) {
        setItems((prev) => [...uploadedItems, ...prev])
      }
    } catch (error) {
      console.error("Error loading gallery:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilesUploaded = async () => {
    // Reload the entire gallery to get fresh data from Supabase
    await loadGalleryImages()
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    setTimeout(() => setUploadError(""), 5000) // Clear error after 5 seconds
  }

  return (
    <>
      <div className="flex align-center justify-center p-5 mb-5">
        <h1 className="text-3xl">Album</h1>
      </div>

      <div className="flex flex-col p-5 mx-auto md:w-6/12 sm:w-full">
        <h4 className="mx-auto">Add your photos!</h4>
        {uploadError && (
          <div className="text-destructive text-sm text-center mb-2">
            {uploadError}
          </div>
        )}
        <FileUpload 
          onFilesUploaded={handleFilesUploaded}
          onUploadError={handleUploadError}
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground mt-4">
          Loading gallery...
        </div>
      )}

      <div className="flex w-5/6 align-center justify center ml-auto mr-auto">
        <Masonry
          items={items}
          ease="back.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="top"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </>
  )
}

export default GalleryPage;
