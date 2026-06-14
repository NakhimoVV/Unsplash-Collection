import type {
  DatabaseCollectionImage,
  DatabaseImage,
} from '@/shared/lib/database/types'

export function mapCollectionImageFromDatabase(
  data: DatabaseCollectionImage,
): DatabaseImage {
  return {
    id: data.id,
    created_at: data.created_at,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash,
    description: data.description,
    user: data.user,
    urls: {
      full: data.urls.full,
      regular: data.urls.regular,
      small: data.urls.small,
      thumb: data.urls.thumb,
    },
    links: data.links,
  }
}
