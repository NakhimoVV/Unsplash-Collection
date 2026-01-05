export type Collection = Readonly<{
  id: string
  name: string
  created_at: string
  updated_at: string
  count_images: number
  preview_images: string[]
  is_system: boolean
}>

export type CollectionImage = Readonly<{
  id: string
  collection_id: string
  created_at: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: string
  urls: string
  links: string
  added_at: string
}>
