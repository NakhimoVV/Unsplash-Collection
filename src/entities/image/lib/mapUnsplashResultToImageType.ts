import { Image } from '@/entities/image/model/type'
import { Result } from '@/shared/api/unsplash/model'

export function mapUnsplashResultToImageType(data: Result): Image {
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
