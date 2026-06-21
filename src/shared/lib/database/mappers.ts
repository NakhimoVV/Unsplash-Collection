import type { UnsplashPhoto } from '@/shared/api/unsplash/model'
import type {
  CollectionImagePayload,
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

export function mapUnsplashPhotoToCollectionImagePayload(
  data: UnsplashPhoto,
): CollectionImagePayload {
  return {
    id: data.id,
    created_at: data.created_at,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash ?? null,
    description: data.description ?? null,
    user: {
      id: data.user.id,
      name: data.user.name,
      profile_image: {
        small: data.user.profile_image.small,
        medium: data.user.profile_image.medium,
        large: data.user.profile_image.large,
      },
    },
    urls: {
      raw: data.urls.raw,
      full: data.urls.full,
      regular: data.urls.regular,
      small: data.urls.small,
      thumb: data.urls.thumb,
    },
    links: {
      self: data.links.self,
      html: data.links.html,
      download: data.links.download,
    },
  }
}
