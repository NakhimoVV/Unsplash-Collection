'use client'

import { useEffect } from 'react'

import GridMasonry from '@/features/Grid'
import { Image } from '@/entities/image/model/type'
import { LIMIT } from '@/shared/constants'
import { useInfinitePagination } from '@/shared/hooks/useInfinitePagination'
import { loadCollectionPhotos } from '@/shared/lib/actions'

type CollectionImagesProps = {
  id: string
  initialItems: Image[]
  totalCount: number
}

const CollectionImages = (props: CollectionImagesProps) => {
  const { id, initialItems, totalCount } = props

  const { items, loadMore, hasMore, isLoading, setItems } =
    useInfinitePagination(async (page) => {
      const data = await loadCollectionPhotos(id, page)

      return {
        items: data.images,
        totalPages: Math.ceil(totalCount / LIMIT),
      }
    })

  useEffect(() => {
    setItems(initialItems)
  }, [id])

  return (
    <GridMasonry
      items={items}
      onLoadMore={loadMore}
      isLoading={isLoading}
      hasMore={hasMore}
    />
  )
}

export default CollectionImages
