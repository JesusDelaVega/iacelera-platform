// Cloudinary configuration for image storage
// Alternativa gratuita a Firebase Storage

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
}

// Upload image to Cloudinary
export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.secure_url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Upload multiple images
export async function uploadImages(
  files: File[],
  folder: string = 'products'
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

// Get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
    quality?: 'auto' | number
  } = {}
): string {
  const { width = 800, height, crop = 'fill', quality = 'auto' } = options

  let url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`

  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`c_${crop}`)
  transformations.push(`q_${quality}`)

  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`
  }

  url += `/${publicId}`

  return url
}
