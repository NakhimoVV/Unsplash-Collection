export const dynamic = 'force-static'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const page = searchParams.get('page') || '1'

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=3`,
      {
        headers: {
          'Accept-Version': 'v1',
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      },
    )
    const data = await response.json()

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
