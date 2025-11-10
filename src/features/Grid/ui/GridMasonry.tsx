'use client'

import styles from './GridMasonry.module.scss'
import { Result, UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { useCallback, useEffect, useState } from 'react'
import { loadPhotos } from '@/features/Search/lib/actions'
import useInfinitieScroll from '@/shared/hooks/useInfinitieScroll'
import GridElement from './GridElement'

type GridMasonryProps = {
  query: string
  initialData: UnsplashSearchResponse
  initialPage?: number
}

const GridMasonry = (props: GridMasonryProps) => {
  const { query, initialData, initialPage = 1 } = props

  const [images, setImages] = useState<Result[]>(initialData.results)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialData.total_pages)
  const [isLoading, setIsLoading] = useState(false)

  const hasMore = currentPage < totalPages

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)
    try {
      const nextPage = currentPage + 1
      // Call Server Action
      const data = await loadPhotos(query, nextPage)

      setImages((prev) => [...prev, ...data.results])
      setCurrentPage(nextPage)
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error('Error loading more photos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [query, currentPage, isLoading, hasMore])

  const { lastElementRef } = useInfinitieScroll({
    action: loadMore,
    canLoad: hasMore && !isLoading,
  })

  // Reset state when "query" changes
  useEffect(() => {
    setImages(initialData.results)
    setCurrentPage(initialPage)
    setTotalPages(initialData.total_pages)
  }, [query, initialData, initialPage])

  return (
    <>
      <div className={styles.imagesGrid}>
        {images.map((image) => (
          <GridElement image={image} key={image.id} />
        ))}
      </div>
      {isLoading && <div className={styles.loader}>Loading...</div>}
      <div ref={lastElementRef} className={styles.triggerBlock} />
    </>
  )
}

export default GridMasonry
