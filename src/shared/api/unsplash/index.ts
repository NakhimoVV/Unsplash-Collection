import { getErrorMessage } from '@/shared/utils/getErrorMessage'

const BASE_URL = 'https://api.unsplash.com/'
const headers = {
  'Accept-Version': 'v1',
  Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
}

export const unsplashApi = {
  async _fetch(endpoint: string) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers,
        cache: 'no-store',
      })

      const isExpectedError =
        !response.ok && response.status >= 400 && response.status < 500

      if (isExpectedError) {
        let errorMessage = `Request failed with status ${response.status}`
        const errorData = await response.json()

        if (errorData?.errors?.length > 0) {
          errorMessage = errorData?.errors?.join('; ')
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error(`Unsplash API error (${endpoint}):`, getErrorMessage(error))
    }
  },

  async getPhotosByQuery(query: string, page: number, perPage: number = 20) {
    return this._fetch(
      `search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    )
  },

  async getPhotoById(id: string) {
    return this._fetch(`photos/${id}`)
  },

  async getFilePhoto(url: string) {
    return this._fetch(url)
  },
}
