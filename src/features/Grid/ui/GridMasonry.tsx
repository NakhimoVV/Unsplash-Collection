'use client'

import styles from './GridMasonry.module.scss'
import GridElement from './GridElement'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { Result } from '@/shared/api/unsplash/model'
import { useMemo } from 'react'
import { useResponsiveColumns } from '@/shared/hooks/useResponsiveColumns'

type GridMasonryProps<T extends Result> = {
  items: T[]
  onLoadMore: () => Promise<void>
  isLoading: boolean
  hasMore: boolean
}

const GridMasonry = <T extends Result>(props: GridMasonryProps<T>) => {
  const { items, onLoadMore, isLoading, hasMore } = props

  const { lastElementRef } = useInfiniteScroll({
    action: onLoadMore,
    canLoad: hasMore && !isLoading,
  })

  const columns = useResponsiveColumns()

  const tetris = (array: T[], countColumn: number) => {
    // Создаём массив колонок
    const arrayColumns: T[][] = Array.from({ length: countColumn }, () => [])
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

  const columnsData = useMemo(() => tetris(items, columns), [items, columns])

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
