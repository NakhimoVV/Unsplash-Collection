//  Independent types for UI
export type Image = {
  id: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: {
    name: string
  }
  urls: {
    small: string
  }
}

export type ImageDetails = Omit<Image, 'urls' | 'user'> & {
  created_at: string
  altDescription: string | null
  user: Image['user'] & {
    profile_image: { medium: string }
  }
  urls: Image['urls'] & {
    full: string
    regular: string
  }
  links: {
    downloadLocation: string
  }
}
