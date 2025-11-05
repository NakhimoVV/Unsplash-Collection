export const unsplashApi = {
  async getPhotosByQuery(query: string, page: number, perPage: number = 20) {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Accept-Version': 'v1',
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch photos from unsplash api!')
    }

    return response.json()
  },
}
