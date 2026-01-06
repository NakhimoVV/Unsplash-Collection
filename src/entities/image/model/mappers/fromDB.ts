import { Image } from '@/entities/image/model/type'
import { CollectionImage } from '@/entities/collection/model/types'

export function fromDB(data: CollectionImage): Image {
  return {
    id: data.id,
    created_at: data.created_at,
    width: data.width,
    height: data.height,
    blur_hash: data.blur_hash,
    description: data.description,
    user: data.user,
    urls: data.urls,
    links: data.links,
  }
}
