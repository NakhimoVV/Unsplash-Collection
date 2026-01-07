import postgres from 'postgres'
import { Collection, CollectionImage } from '@/entities/collection/model/types'
import { fromDB } from '@/entities/image/model/mappers/fromDB'

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchCollections() {
  const data = await sql<Collection[]>`
    SELECT
      c.*,
      COUNT(ci.id) AS count_images,
      COALESCE(
        (ARRAY_AGG(
          ci.urls->>'thumb'
          ORDER BY ci.added_at DESC
          )
          FILTER (WHERE ci.urls ? 'thumb')
        )[1:3],
        ARRAY[]::text[]
      ) AS preview_images
    FROM collections c
    LEFT JOIN collection_images ci ON ci.collection_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `

  return data.map((item) => ({
    ...item,
    count_images: Number(item.count_images),
  }))
}
// TODO: Продолжение следует...
export async function fetchCollectionById(id: string) {
  const data = await sql<Pick<Collection, 'name' | 'count_images'>[]>`
    SELECT
      c.id,
      c.name,
      COUNT(ci.id) AS count_images
    FROM collections c
    LEFT JOIN collection_images ci ON ci.collection_id = c.id
    WHERE c.id = ${id}
    GROUP BY c.id
    LIMIT 1
  `

  if (!data[0]) {
    return null
  }

  return {
    ...data[0],
    count_images: Number(data[0].count_images),
  }
}

export async function fetchPhotosFromCollectionById(id: string) {
  const data = await sql<CollectionImage[]>`
    SELECT *
    FROM collection_images
    WHERE collection_id = ${id}
    ORDER BY added_at DESC
  `

  return data.map(fromDB)
}
