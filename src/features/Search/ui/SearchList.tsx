'use client'

import { useCallback, useEffect } from 'react'

import GridMasonry from '@/features/Grid'
import Search from '@/features/Search'
import { fromUnsplash } from '@/entities/image/model/mappers/fromUnsplash'
import { Image } from '@/entities/image/model/type'
import { useInfinitePagination } from '@/shared/hooks/useInfinitePagination'
import { loadPhotos } from '@/shared/lib/actions'

import styles from './SearchList.module.scss'

type SearchListProps = {
  query: string
  page: number
  initialData: Image[]
  totalPages: number
}

const SearchList = (props: SearchListProps) => {
  const { query, page, initialData, totalPages } = props
  const titleId = 'search-title'
  // TODO: чекнуть возможные проблемы с blurhash!
  // TODO: при нажатии назад всё заново загружается(
  const fetchSearchPage = useCallback(
    async (page: number) => {
      const data = await loadPhotos(query, page)

      return {
        items: data.results.map(fromUnsplash),
        totalPages: data.total_pages,
      }
    },
    [query],
  )

  const { items, hasMore, loadMore, isLoading, reset } =
    useInfinitePagination(fetchSearchPage)

  useEffect(() => {
    reset({
      items: initialData,
      page,
      hasMore: page < totalPages,
    })
  }, [initialData, page, reset, totalPages])

  return (
    <section aria-labelledby={titleId}>
      <h1 className="visually-hidden" id={titleId}>
        {query}
      </h1>
      <div className={styles.gradientLine}></div>
      <div className={styles.searchContainer}>
        <Search placeholder="Enter your keywords..." />
      </div>
      <div className="container">
        <GridMasonry
          items={items}
          onLoadMore={loadMore}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>
    </section>
  )
}

export default SearchList
