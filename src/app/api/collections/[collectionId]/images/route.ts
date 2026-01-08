import { fetchImagesFromCollectionById } from '@/app/lib/database'

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ collectionId: string }>
  },
) {
  const { collectionId } = await params
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? 1)

  try {
    return Response.json(
      await fetchImagesFromCollectionById(collectionId, page),
    )
  } catch (error) {
    console.error('Failed to fetch collection:', error)

    return Response.json(
      { error: 'Failed to fetch collection' },
      { status: 500 },
    )
  }
}
