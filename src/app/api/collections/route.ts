import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

async function listCollections() {
  const data = await sql`
    SELECT *
    FROM collections
    ORDER BY created_at DESC
  `

  return data
}

export async function GET() {
  try {
    return Response.json(await listCollections())
  } catch (error) {
    console.error('Failed to fetch collections:', error)

    return Response.json(
      { error: 'Failed to fetch collections' },
      { status: 500 },
    )
  }
}
