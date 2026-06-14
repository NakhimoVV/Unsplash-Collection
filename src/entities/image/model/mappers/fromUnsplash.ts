import type { Image, ImageDetails } from '@/entities/image/model/type'
import type { Result, UnsplashPhoto } from '@/shared/api/unsplash/model'

export function fromUnsplash(data: Result): Image {
  return {
    id: data.id,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash || null,
    description: data.description || null,
    user: {
      name: data.user.name,
    },
    urls: {
      small: data.urls.small,
    },
  }
}

export function fromUnsplashPhoto(data: UnsplashPhoto): ImageDetails {
  const image = fromUnsplash(data)

  return {
    ...image,
    created_at: data.created_at,
    altDescription: data.alt_description,
    user: {
      ...image.user,
      profile_image: {
        medium: data.user.profile_image.medium,
      },
    },
    urls: {
      ...image.urls,
      full: data.urls.full,
      regular: data.urls.regular,
    },
    links: {
      downloadLocation: data.links.download_location,
    },
  }
}
