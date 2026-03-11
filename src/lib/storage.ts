import { supabase } from '@/lib/supabase'

export type UploadResult = {
  url: string
  path: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name (default: 'gallery')
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with public URL and path
 */
export async function uploadFile(
  file: File,
  bucket = 'gallery',
  folder = 'photos'
): Promise<UploadResult> {
  try {
    // Generate unique filename with timestamp
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message,
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - File path in storage
 * @param bucket - Storage bucket name (default: 'gallery')
 */
export async function deleteFile(
  path: string,
  bucket = 'gallery'
): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error('Delete error:', error)
      return { error: error.message }
    }

    return {}
  } catch (error) {
    console.error('Delete failed:', error)
    return {
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * List all files in a bucket folder
 * @param bucket - Storage bucket name (default: 'gallery')
 * @param folder - Folder path (default: 'photos')
 */
export async function listFiles(
  bucket = 'gallery',
  folder = 'photos'
): Promise<{ files: Array<{ name: string; url: string }>; error?: string }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.error('List error:', error)
      return { files: [], error: error.message }
    }

    // Get public URLs for all files, filtering out .emptyFolderPlaceholder
    if (!data) {
      return { files: [] }
    }
    const files = data
      .filter(file => file.name !== '.emptyFolderPlaceholder') // Fix duplicate key error
      .map((file) => {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(`${folder}/${file.name}`)

        return {
          name: file.name,
          url: publicUrl,
        }
      })

    return { files }
  } catch (error) {
    console.error('List failed:', error)
    return {
      files: [],
      error: error instanceof Error ? error.message : 'List failed',
    }
  }
}
