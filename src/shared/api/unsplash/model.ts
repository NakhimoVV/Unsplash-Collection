export type UnsplashSearchResponse = {
  readonly total: number
  readonly total_pages: number
  readonly results: Result[]
}

export type Result = {
  readonly id: string
  readonly created_at: string
  readonly width: number
  readonly height: number
  readonly color: string
  readonly blur_hash?: string | null
  readonly likes: number
  readonly liked_by_user?: boolean
  readonly description?: string | null
  readonly user: User
  readonly current_user_collections?: any[]
  readonly urls: Urls
  readonly links: ResultLinks
}

export type ResultLinks = {
  readonly self: string
  readonly html: string
  readonly download: string
}

export type Urls = {
  readonly raw: string
  readonly full: string
  readonly regular: string
  readonly small: string
  readonly thumb: string
}

export type User = {
  readonly id: string
  readonly username: string
  readonly name: string
  readonly first_name?: string | null
  readonly last_name?: string | null
  readonly instagram_username?: string | null
  readonly twitter_username?: string | null
  readonly portfolio_url?: string | null
  readonly profile_image?: ProfileImage
  readonly links: UserLinks
}

export type UserLinks = {
  readonly self: string
  readonly html: string
  readonly photos: string
  readonly likes: string
}

export type ProfileImage = {
  readonly small: string
  readonly medium: string
  readonly large: string
}
