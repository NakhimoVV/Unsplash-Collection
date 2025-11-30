import postgres from 'postgres'
import { Collection, CollectionImage } from '@/entities/collection/model/types'

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchCollections() {
  const data = await sql<Collection[]>`
    SELECT *
    FROM collections
    ORDER BY created_at DESC
  `

  return data
}

export async function fetchPhotosFromCollectionById(id: string) {
  const data = await sql<CollectionImage[]>`
    SELECT *
    FROM collection_images
    WHERE collection_id = ${id}
    ORDER BY added_at DESC
  `

  return data
}
