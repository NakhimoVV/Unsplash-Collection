import { fetchPhotosFromCollectionById } from '@/app/lib/database'

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ collectionId: string }>
  },
) {
  const { collectionId } = await params

  try {
    return Response.json(await fetchPhotosFromCollectionById(collectionId))
  } catch (error) {
    console.error('Failed to fetch collection:', error)

    return Response.json(
      { error: 'Failed to fetch collection' },
      { status: 500 },
    )
  }
}
