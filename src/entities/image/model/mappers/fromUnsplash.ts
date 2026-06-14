import type { Image, ImageDetails } from '@/entities/image/model/type'
import type { Result, UnsplashPhoto } from '@/shared/api/unsplash/model'

export function fromUnsplash(data: Result): Image {
  return {
    id: data.id,
    created_at: data.created_at,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash || null,
    description: data.description || null,
    user: {
      id: data.user.id,
      name: data.user.name,
      profile_image: data.user.profile_image,
    },
    urls: {
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

export function fromUnsplashPhoto(data: UnsplashPhoto): ImageDetails {
  const image = fromUnsplash(data)

  return {
    ...image,
    altDescription: data.alt_description,
    links: {
      ...image.links,
      downloadLocation: data.links.download_location,
    },
  }
}
