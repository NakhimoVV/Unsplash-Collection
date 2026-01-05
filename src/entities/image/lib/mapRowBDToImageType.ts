import { Image } from '@/entities/image/model/type'
import { CollectionImage } from '@/entities/collection/model/types'

export function mapRowBDToImageType(data: CollectionImage): Image {
  const user = JSON.parse(data.user)
  const urls = JSON.parse(data.urls)
  const links = JSON.parse(data.links)

  return {
    id: data.id,
    created_at: data.created_at,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash,
    description: data.description,
    user: {
      id: user.id,
      name: user.name,
      profile_image: user.profile_image,
    },
    urls: {
      raw: urls.raw,
      full: urls.full,
      regular: urls.regular,
      small: urls.small,
      thumb: urls.thumb,
    },
    links: {
      self: links.self,
      html: links.html,
      download: links.download,
    },
  }
}
