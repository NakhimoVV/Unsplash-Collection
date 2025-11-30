import { fetchCollections } from '@/app/lib/database'

export async function GET() {
  try {
    return Response.json(await fetchCollections())
  } catch (error) {
    console.error('Failed to fetch collections:', error)

    return Response.json(
      { error: 'Failed to fetch collections' },
      { status: 500 },
    )
  }
}
