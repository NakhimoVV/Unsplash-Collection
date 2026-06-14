export type UnsplashSearchResponse = Readonly<{
  total: number
  total_pages: number
  results: Result[]
}>

export type UnsplashPhoto = Result &
  Readonly<{
    alt_description: string | null
    links: ResultLinks &
      Readonly<{
        download_location: string
      }>
  }>

export type Result = Readonly<{
  id: string
  created_at: string
  width: number
  height: number
  color: string
  blur_hash?: string | null
  likes: number
  liked_by_user?: boolean
  description?: string | null
  user: User
  urls: Urls
  links: ResultLinks
}>

export type ResultLinks = Readonly<{
  self: string
  html: string
  download: string
}>

export type Urls = Readonly<{
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
}>

export type User = Readonly<{
  id: string
  username: string
  name: string
  first_name?: string | null
  last_name?: string | null
  instagram_username?: string | null
  twitter_username?: string | null
  portfolio_url?: string | null
  profile_image: ProfileImage
  links: UserLinks
}>

export type UserLinks = Readonly<{
  self: string
  html: string
  photos: string
  likes: string
}>

export type ProfileImage = Readonly<{
  small: string
  medium: string
  large: string
}>
