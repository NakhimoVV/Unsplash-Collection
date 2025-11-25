'use client'

import styles from './SearchList.module.scss'
import Search from '@/features/Search'
import GridMasonry from '@/features/Grid'
import { useInfinitePagination } from '@/shared/hooks/useInfinitePagination'
import { useEffect } from 'react'
import { loadPhotos } from '@/features/Search/lib/actions'
import { Result } from '@/shared/api/unsplash/model'

type SearchListProps = {
  query: string
  page: number
  initialData: Result[]
}

const SearchList = (props: SearchListProps) => {
  const { query, page, initialData } = props
  const titleId = 'search-title'
  // TODO: чекнуть возможные проблемы с blurhash!
  // TODO: при нажатии назад всё заново загружается(
  const { items, hasMore, loadMore, isLoading, setItems, reset } =
    useInfinitePagination(async (page) => {
      const data = await loadPhotos(query, page)
      return {
        items: data.results,
        totalPages: data.total_pages,
      }
    })

  useEffect(() => {
    setItems(initialData)
    reset()
  }, [query, page])

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
