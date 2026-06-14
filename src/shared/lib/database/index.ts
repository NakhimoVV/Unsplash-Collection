import postgres from 'postgres'

import { LIMIT } from '@/shared/constants'
import { mapCollectionImageFromDatabase } from '@/shared/lib/database/mappers'

import type {
  DatabaseCollection,
  DatabaseCollectionImage,
} from '@/shared/lib/database/types'

export const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' })

export async function fetchCollections() {
  const data = await sql<DatabaseCollection[]>`
    SELECT
      c.*,
      COUNT(ci.id) AS count_images,
      COALESCE(
        (ARRAY_AGG(
          ci.urls->>'small'
          ORDER BY ci.added_at DESC
          )
          FILTER (WHERE ci.urls ? 'small')
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

export async function fetchCollectionById(id: string) {
  const data = await sql<
    Pick<DatabaseCollection, 'id' | 'name' | 'count_images'>[]
  >`
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
    return {
      name: 'No data!',
      count_images: 0,
    }
  }

  return {
    ...data[0],
    count_images: Number(data[0].count_images),
  }
}

export async function fetchImagesFromCollectionById(id: string, page: number) {
  const offset = (page - 1) * LIMIT

  const images = await sql<DatabaseCollectionImage[]>`
    SELECT *
    FROM collection_images
    WHERE collection_id = ${id}
    ORDER BY added_at DESC
    LIMIT ${LIMIT}
    OFFSET ${offset}
  `

  const [{ count }] = await sql<{ count: string }[]>`
    SELECT COUNT(*) AS count
    FROM collection_images
    WHERE collection_id = ${id}
  `

  return {
    images: images.map(mapCollectionImageFromDatabase),
    totalCount: Number(count),
  }
}
