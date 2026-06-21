import postgres from 'postgres'

import { LIMIT } from '@/shared/constants'
import {
  mapCollectionImageFromDatabase,
  mapUnsplashPhotoToCollectionImagePayload,
} from '@/shared/lib/database/mappers'

import type { UnsplashPhoto } from '@/shared/api/unsplash/model'
import type {
  CollectionImagePayload,
  DatabaseCollection,
  DatabaseCollectionImage,
  DatabaseCollectionWithPhotoMembership,
} from '@/shared/lib/database/types'

export const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' })

let collectionImagesPrimaryKeyMigration: Promise<void> | null = null

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

export async function fetchCollectionsWithPhotoMembership(photoId: string) {
  const data = await sql<DatabaseCollectionWithPhotoMembership[]>`
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
      ) AS preview_images,
      EXISTS (
        SELECT 1
        FROM collection_images current_photo
        WHERE current_photo.collection_id = c.id
          AND current_photo.id = ${photoId}
      ) AS has_current_photo
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

export async function addImageToCollection(
  collectionId: string,
  photo: UnsplashPhoto,
) {
  const image = mapUnsplashPhotoToCollectionImagePayload(photo)

  await ensureCollectionImagesCompositePrimaryKey()
  await insertCollectionImage(collectionId, image)
}

export async function removeImageFromCollection(
  collectionId: string,
  photoId: string,
) {
  await sql`
    DELETE FROM collection_images
    WHERE collection_id = ${collectionId}
      AND id = ${photoId}
  `
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

async function insertCollectionImage(
  collectionId: string,
  image: CollectionImagePayload,
) {
  await sql`
    INSERT INTO collection_images (
      collection_id, id, created_at, width, height,
      blur_hash, description, "user", "urls", "links"
    )
    VALUES (
      ${collectionId},
      ${image.id},
      ${image.created_at},
      ${image.width},
      ${image.height},
      ${image.blur_hash},
      ${image.description},
      ${sql.json(image.user)},
      ${sql.json(image.urls)},
      ${sql.json(image.links)}
    )
    ON CONFLICT (collection_id, id) DO NOTHING
  `
}

async function ensureCollectionImagesCompositePrimaryKey() {
  collectionImagesPrimaryKeyMigration ??= migrateCollectionImagesPrimaryKey()

  await collectionImagesPrimaryKeyMigration
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
