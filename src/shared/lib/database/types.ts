export type DatabaseCollection = Readonly<{
  id: string
  name: string
  created_at: string
  updated_at: string
  count_images: number
  preview_images: string[]
  is_system: boolean
}>

export type DatabaseCollectionWithPhotoMembership = DatabaseCollection &
  Readonly<{
    has_current_photo: boolean
    is_current_photo_system: boolean
  }>

export type CollectionImagePayload = Readonly<{
  id: string
  created_at: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: DatabaseCollectionImage['user']
  urls: DatabaseCollectionImage['urls']
  links: DatabaseCollectionImage['links']
}>

export type DatabaseCollectionImage = Readonly<{
  id: string
  collection_id: string
  created_at: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: {
    id: string
    name: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
  }
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
  }
  added_at: string
  is_system: boolean
}>

export type DatabaseImage = Readonly<{
  id: string
  created_at: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: {
    id: string
    name: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
  }
  urls: {
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
  }
}>
