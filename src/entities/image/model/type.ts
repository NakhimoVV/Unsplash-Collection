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
    id: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
  }
  urls: Image['urls'] & {
    raw: string
    full: string
    regular: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
    downloadLocation: string
  }
}
