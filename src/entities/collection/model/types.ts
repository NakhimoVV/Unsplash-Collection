export type Collection = {
  readonly id: string
  readonly name: string
  readonly created_at: string
  readonly updated_at: string
  readonly is_system: boolean
}

export interface CollectionImage {
  readonly id: string
  readonly collection_id: string
  readonly created_at: string
  readonly width: number
  readonly height: number
  readonly blur_hash: string | null
  readonly description: string | null
  readonly user: string
  readonly urls: string
  readonly links: string
  readonly added_at: string
}
