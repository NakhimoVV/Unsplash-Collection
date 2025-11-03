export const unsplashApi = {
  async getPhotosByQuery(query: string, currentPage: number) {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${currentPage}&per_page=10`,
      {
        headers: {
          'Accept-Version': 'v1',
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch photos')
    }

    return response.json()
  },
}
