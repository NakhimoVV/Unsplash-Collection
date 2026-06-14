import postgres from 'postgres'

import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { collections } from '@/shared/lib/default-collections'

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
  // Запрещаем удаление дефолтных коллекций на уровне базы данных
  await sql`
    CREATE OR REPLACE FUNCTION prevent_system_delete()
    RETURNS trigger AS $$
    BEGIN
        IF OLD.is_system THEN
            RAISE EXCEPTION 'Cannot delete default collection!';
        END IF;
        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `
  await sql`
    CREATE TRIGGER collections_system_remove
    BEFORE DELETE ON collections
    FOR EACH ROW EXECUTE FUNCTION prevent_system_delete();
  `

  const insertedCollections = await Promise.all(
    collections.map(async (collection) => {
      return sql`
        INSERT INTO collections (id, name, is_system)
        VALUES (${collection.id}, ${collection.name}, ${collection.is_system})
        ON CONFLICT (id) DO NOTHING
      `
    }),
  )

  return insertedCollections
}

async function seedCollectionsImages() {
  await sql`
    CREATE TABLE IF NOT EXISTS collection_images (
      id TEXT PRIMARY KEY,
      collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
      created_at TEXT,
      width INT,
      height INT,
      blur_hash TEXT,
      description TEXT,
      "user" JSONB NOT NULL,
      "urls" JSONB NOT NULL,
      "links" JSONB NOT NULL,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(collection_id, id)
    );
  `

  const insertedImagesToCollections = await Promise.all(
    collections.map(async (collection) => {
      console.log(`🔄 Fetching images for: ${collection.name}`)
      const currentImages: UnsplashSearchResponse =
        await unsplashApi.getPhotosByQuery(collection.name, 1, 16)

      console.log(`📷 Found ${currentImages.results.length} images`)
      const imageInserts = await Promise.all(
        currentImages.results.map(async (image) => {
          return sql`
              INSERT INTO collection_images (
                collection_id, id, created_at, width, height, 
                blur_hash, description, "user", "urls", "links"
              )
              VALUES (
                ${collection.id},
                ${image.id},
                ${image.created_at},
                ${image.width},
                ${image.height},
                ${image.blur_hash ?? null},
                ${image.description ?? null},
                ${sql.json(image.user)},
                ${sql.json(image.urls)},
                ${sql.json(image.links)}
              )
              ON CONFLICT (collection_id, id) DO NOTHING
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

    await seedCollections()
    console.log('✅ Collections created')

    await seedCollectionsImages()
    console.log('✅ Images added')

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('💥 Seed failed:', error)
    return Response.json({ error }, { status: 500 })
  }
}
