'use client'

import styles from './GridMasonry.module.scss'
import { Result, UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

  const columns = 4
  const tetris = (array: Result[], countColumn: number) => {
    // Создаём массив колонок
    const arrayColumns: Result[][] = Array.from(
      { length: countColumn },
      () => [],
    )
    // Создаём массив их высот
    const columnHeights: number[] = new Array(countColumn).fill(0)

    // Итерируемся по array
    array.forEach((item) => {
      // Вычисляем высоту изображения на основе пропорций
      const aspectRatio = item.width / item.height
      const imageHeight = 400 / aspectRatio
      // Ищем колонку с наименьшей высотой
      let minHeight = columnHeights[0]
      let targetColumn = 0

      for (let i = 1; i < countColumn; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i]
          targetColumn = i
        }
      }

      // Добавляем элемент в колонку с наименьшей высотой
      arrayColumns[targetColumn].push(item)
      // Актуализируем высоту
      columnHeights[targetColumn] += imageHeight
    })

    // Возвращаем
    return arrayColumns
  }

  const columnsData = useMemo(
    () => tetris(images, columns),
    [images, columns, tetris],
  )

  return (
    <>
      <div className={styles.imagesGrid}>
        {columnsData.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((image) => (
              <GridElement image={image} key={image.id} />
            ))}
          </div>
        ))}
      </div>
      {isLoading && <div className={styles.loader}>Loading...</div>}
      <div ref={lastElementRef} className={styles.triggerBlock} />
    </>
  )
}

export default GridMasonry
