import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

async function fetchCollectionById(id: string) {
  const data = await sql`
    SELECT *
    FROM collection_images
    WHERE collection_id = ${id}
    ORDER BY added_at DESC
  `

  return data
}

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
    return Response.json(await fetchCollectionById(collectionId))
  } catch (error) {
    console.error('Failed to fetch collection:', error)

    return Response.json(
      { error: 'Failed to fetch collection' },
      { status: 500 },
    )
  }
}
