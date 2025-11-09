'use client'

import { useCallback, useEffect, useState } from 'react'
import { Result, UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { loadPhotos } from '@/features/Search/lib/actions'
import useInfinitieScroll from '@/shared/hooks/useInfinitieScroll'
import { useBlurDataURL } from '@/shared/hooks/useBlurDataURL'
import Image from 'next/image'
import styles from './ImagesGridWithInfiniteScroll.module.scss'

type ImagesGridWithInfiniteScrollProps = {
  query: string
  initialData: UnsplashSearchResponse
  initialPage?: number
}
// TODO: декомпозировать
const ImagesGridWithInfiniteScroll = ({
  query,
  initialData,
  initialPage = 1,
}: ImagesGridWithInfiniteScrollProps) => {
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
    dependency: hasMore && !isLoading,
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
          <ImageWithBlur key={image.id} image={image} />
        ))}
      </div>
      {isLoading && <div className={styles.loader}>Loading...</div>}
      <div ref={lastElementRef} className={styles.triggerBlock} />
    </>
  )
}

// Component Image with blur placeholder
const ImageWithBlur = ({ image }: { image: Result }) => {
  const blurDataURL = useBlurDataURL(image.blur_hash)

  // Calc the correct dimensions to maintain proportions
  const aspectRatio = image.width / image.height
  const baseWidth = 400
  const calculatedHeight = Math.round(baseWidth / aspectRatio)

  return (
    <div className={styles.imageWrapper}>
      <Image
        className={styles.image}
        src={image.urls.small}
        alt={image.description || `Photo by ${image.user.name}`}
        width={baseWidth}
        height={calculatedHeight}
        loading="lazy"
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    </div>
  )
}

export default ImagesGridWithInfiniteScroll
