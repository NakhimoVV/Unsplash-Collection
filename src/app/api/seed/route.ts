import postgres from 'postgres'

import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { collections } from '@/shared/lib/default-collections'

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' })

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
    DROP TRIGGER IF EXISTS collections_system_remove
    ON collections;
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
      id TEXT,
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
      is_system BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (collection_id, id)
    );
  `

  await migrateCollectionImagesPrimaryKey()
  await migrateCollectionImagesSystemProtection()
  await createCollectionImagesSystemDeleteTrigger()

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
                blur_hash, description, "user", "urls", "links", is_system
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
                ${sql.json(image.links)},
                true
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

async function migrateCollectionImagesSystemProtection() {
  const [{ exists: hasSystemFlag }] = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'collection_images'
        AND column_name = 'is_system'
    )
  `

  if (hasSystemFlag) {
    return
  }

  await sql.begin(async (transaction) => {
    await transaction`
      ALTER TABLE collection_images
      ADD COLUMN is_system BOOLEAN
    `

    await transaction`
      UPDATE collection_images ci
      SET is_system = true
      FROM collections c
      WHERE ci.collection_id = c.id
        AND c.is_system = true
    `

    await transaction`
      UPDATE collection_images
      SET is_system = false
      WHERE is_system IS NULL
    `

    await transaction`
      ALTER TABLE collection_images
      ALTER COLUMN is_system SET NOT NULL,
      ALTER COLUMN is_system SET DEFAULT false
    `
  })
}

async function createCollectionImagesSystemDeleteTrigger() {
  await sql`
    CREATE OR REPLACE FUNCTION prevent_system_collection_image_delete()
    RETURNS trigger AS $$
    BEGIN
        IF OLD.is_system THEN
            RAISE EXCEPTION 'Cannot delete default collection image!';
        END IF;
        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `
  await sql`
    DROP TRIGGER IF EXISTS collection_images_system_remove
    ON collection_images;
  `
  await sql`
    CREATE TRIGGER collection_images_system_remove
    BEFORE DELETE ON collection_images
    FOR EACH ROW EXECUTE FUNCTION prevent_system_collection_image_delete();
  `
}

async function migrateCollectionImagesPrimaryKey() {
  await sql.begin(async (transaction) => {
    const [{ constraint_name: primaryKeyName } = { constraint_name: null }] =
      await transaction<{ constraint_name: string | null }[]>`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'collection_images'
          AND tc.constraint_type = 'PRIMARY KEY'
        LIMIT 1
      `

    const [{ primary_key_columns: primaryKeyColumns }] = await transaction<
      { primary_key_columns: string[] | null }[]
    >`
      SELECT ARRAY_AGG(kcu.column_name ORDER BY kcu.ordinal_position) AS primary_key_columns
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = 'collection_images'
        AND tc.constraint_type = 'PRIMARY KEY'
    `

    const hasCompositePrimaryKey =
      primaryKeyColumns?.length === 2 &&
      primaryKeyColumns[0] === 'collection_id' &&
      primaryKeyColumns[1] === 'id'

    if (hasCompositePrimaryKey) {
      return
    }

    if (primaryKeyName) {
      await transaction`
        ALTER TABLE collection_images
        DROP CONSTRAINT ${transaction(primaryKeyName)}
      `
    }

    await transaction`
      ALTER TABLE collection_images
      ADD PRIMARY KEY (collection_id, id)
    `
  })
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
