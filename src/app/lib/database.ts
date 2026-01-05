import postgres from 'postgres'
import { Collection, CollectionImage } from '@/entities/collection/model/types'
import { mapRowBDToImageType } from '@/entities/image/lib/mapRowBDToImageType'

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchCollections() {
  const data = await sql<Collection[]>`
    SELECT
      c.*,
      COUNT(ci.collection_id) AS count_images,
      COALESCE(
        (ARRAY_AGG(
            (ci.urls::json)::json->>'thumb'
            ORDER BY ci.added_at DESC
            ) FILTER (WHERE (ci.urls::json)::json->>'thumb' IS NOT NULL)
        )[1:3],
        '{}'::text[]
      ) as preview_images
    FROM collections c
    LEFT JOIN collection_images ci ON ci.collection_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `
  // TODO:не видно "thumb"
  return data.map((item) => ({
    ...item,
    count_images: Number(item.count_images),
  }))
}

export async function fetchPhotosFromCollectionById(id: string) {
  const data = await sql<CollectionImage[]>`
    SELECT *
    FROM collection_images
    WHERE collection_id = ${id}
    ORDER BY added_at DESC
  `

  return data.map(mapRowBDToImageType)
}
