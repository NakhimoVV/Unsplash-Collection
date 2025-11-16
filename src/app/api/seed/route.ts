import postgres from 'postgres'
import { collections } from '@/app/lib/default-collections'
import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

async function seedCollections() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await sql`
    CREATE TABLE IF NOT EXISTS collections (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      is_system BOOLEAN DEFAULT false
    );
  `

  const insertedCollections = await Promise.all(
    collections.map(async (collection) => {
      return sql`
        INSERT INTO collections (name, is_system)
        VALUES (${collection.name}, ${collection.is_system})
        ON CONFLICT (id) DO NOTHING
      `
    }),
  )

  return insertedCollections
}

async function seedCollectionsImages() {
  await sql`
    CREATE TABLE IF NOT EXISTS collection_images (
      collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
      added_at TIMESTAMP DEFAULT NOW(),
      id TEXT PRIMARY KEY,
      created_at TEXT,
      width INT,
      height INT,
      blur_hash TEXT,
      description TEXT,
      user JSONB NOT NULL,
      urls JSONB NOT NULL,
      links JSONB NOT NULL
    );
  `

  const dbCollections =
    await sql`SELECT id, name FROM collections WHERE is_system = true`

  const insertedImagesToCollections = await Promise.all(
    dbCollections.map(async (collection) => {
      const currentImages: UnsplashSearchResponse =
        await unsplashApi.getPhotosByQuery(collection.name, 1, 16)

      const imageInserts = await Promise.all(
        currentImages.results.map(async (image) => {
          return sql`
              INSERT INTO collection_images (
                collection_id, id, created_at, width, height, 
                blur_hash, description, user, urls, links
              )
              VALUES (
                ${collection.id},
                ${image.id},
                ${image.created_at},
                ${image.width},
                ${image.height},
                ${image.blur_hash ?? null},
                ${image.description ?? null},
                ${JSON.stringify(image.user)},
                ${JSON.stringify(image.urls)},
                ${JSON.stringify(image.links)}
              )
              ON CONFLICT (id) DO NOTHING
            `
        }),
      )
      return imageInserts
    }),
  )

  return insertedImagesToCollections
}

export async function GET() {
  try {
    console.log('🌱 Starting database seed...')

    const result = await sql.begin((sql) => [
      seedCollections(),
      seedCollectionsImages(),
    ])

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('💥 Seed failed:', error)
    return Response.json({ error }, { status: 500 })
  }
}
