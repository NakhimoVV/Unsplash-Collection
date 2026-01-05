//  Independent types for UI
export type Image = {
  id: string
  created_at: string
  width: number
  height: number
  blur_hash: string | null
  description: string | null
  user: {
    id: string
    name: string
    profile_image: { small: string; medium: string; large: string }
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
}
// TODO: удалить не используемые поля!
