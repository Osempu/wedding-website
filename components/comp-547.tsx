import { useState } from "react"
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { formatBytes, useFileUpload, type FileWithPreview } from "../hooks/use-file-upload"
import { Button } from "../components/ui/button"
import { uploadFile } from "../src/lib/storage"

type FileUploadProps = {
  onFilesUploaded?: (files: FileWithPreview[]) => void
  onUploadError?: (error: string) => void
}

export default function FileUpload({ onFilesUploaded, onUploadError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024 // 5MB default
  const maxFiles = 6

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    // Remove onFilesAdded - we'll upload manually instead
  })

  // Manual upload handler triggered by button click
  const handleUploadClick = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const uploadedFiles: FileWithPreview[] = []

    try {
      for (const fileWithPreview of files) {
        // Only upload actual File objects, not FileMetadata
        if (fileWithPreview.file instanceof File) {
          const result = await uploadFile(fileWithPreview.file)

          if (result.error) {
            onUploadError?.(result.error)
            console.error(`Failed to upload ${fileWithPreview.file.name}:`, result.error)
          } else {
            uploadedFiles.push(fileWithPreview)
          }
        }
      }

      // Notify parent component of successful uploads
      if (uploadedFiles.length > 0) {
        onFilesUploaded?.(uploadedFiles)
        clearFiles() // Clear files after successful upload
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onUploadError?.(errorMessage)
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={openFileDialog}
            disabled={isUploading}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            {isUploading ? "Uploading..." : "Select images"}
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-accent aspect-square shrink-0 rounded">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-10 rounded-[inherit] object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(file.file.size)}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remove all files
              </Button>
            </div>
          )}

          {/* Upload button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleUploadClick}
              disabled={isUploading || files.length === 0}
              className="flex-1"
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              {isUploading ? "Uploading..." : `Upload ${files.length} ${files.length === 1 ? 'image' : 'images'}`}
            </Button>
          </div>
        </div>
      )}

      <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-center text-xs"
      >
        Multiple image uploader w/ image list ∙{" "}
        <a
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
          className="hover:text-foreground underline"
        >
          API
        </a>
      </p>
    </div>
  );
}
