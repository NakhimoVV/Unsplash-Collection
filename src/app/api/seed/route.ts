import postgres from 'postgres'
import { collections } from '@/app/lib/default-collections'

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
        ON CONFLICT (id) DO NOTHING;
      `
    }),
  )

  return insertedCollections
}

async function seedCollectionsImages() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await sql`
    CREATE TABLE IF NOT EXISTS collection_images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
      image_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      author TEXT,
      description TEXT,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(collection_id, image_id)
    );
  `

  const insertedImagesToCollections = await Promise.all(
    collections.map(async (collection) => {
      return sql`
        INSERT INTO collection_images (collection_id, image_id, image_url, description)
        VALUES (${collection.name}, ${collection.is_system})
        ON CONFLICT (id) DO NOTHING;
      `
    }),
  )

  return insertedImagesToCollections
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedCollections(),
      seedCollectionsImages(),
    ])

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
