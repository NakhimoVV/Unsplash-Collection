import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

export const unsplashApi = {
  async searchPhotos(query: string, page = 1): Promise<UnsplashSearchResponse> {
    const response = await fetch(
      `/search?query=${encodeURIComponent(query)}&page=${page}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch photos')
    }

    return response.json()
  },
}
