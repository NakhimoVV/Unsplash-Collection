'use client'

import { useCallback, useEffect } from 'react'

import GridMasonry from '@/features/grid'
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
  const totalPages = Math.ceil(totalCount / LIMIT)

  const fetchCollectionPage = useCallback(
    async (page: number) => {
      const data = await loadCollectionPhotos(id, page)

      return {
        items: data.images,
        totalPages,
      }
    },
    [id, totalPages],
  )

  const { items, loadMore, hasMore, isLoading, reset } =
    useInfinitePagination(fetchCollectionPage)

  useEffect(() => {
    reset({
      items: initialItems,
      hasMore: totalPages > 1,
    })
  }, [initialItems, reset, totalPages])

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
