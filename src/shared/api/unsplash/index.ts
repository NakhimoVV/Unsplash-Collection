import {
  Result,
  UnsplashPhoto,
  UnsplashSearchResponse,
} from '@/shared/api/unsplash/model'

const BASE_URL = 'https://api.unsplash.com/'
const headers = {
  'Accept-Version': 'v1',
  Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
}

type UnsplashErrorResponse = Readonly<{
  errors: string[]
}>

function isUnsplashErrorResponse(data: unknown): data is UnsplashErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'errors' in data &&
    Array.isArray(data.errors) &&
    data.errors.every((error) => typeof error === 'string')
  )
}

export const unsplashApi = {
  async _fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      const errorData: unknown = await response.json().catch(() => null)

      if (isUnsplashErrorResponse(errorData) && errorData.errors.length > 0) {
        errorMessage = errorData.errors.join('; ')
      }
      throw new Error(errorMessage)
    }

    return (await response.json()) as T
  },

  async getPhotosByQuery(
    query: string,
    page: number,
    perPage: number = 20,
  ): Promise<UnsplashSearchResponse> {
    return this._fetch<UnsplashSearchResponse>(
      `search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    )
  },

  async getPhotoById(id: string): Promise<UnsplashPhoto> {
    return this._fetch<UnsplashPhoto>(`photos/${id}`)
  },

  async getFilePhoto(url: string): Promise<Result> {
    return this._fetch<Result>(url)
  },
}
