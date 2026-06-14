import { useCallback, useState } from 'react'

type PageResult<T> = {
  items: T[]
  totalPages?: number
}

type ResetOptions<T> = {
  items?: T[]
  page?: number
  hasMore?: boolean
}

export function useInfinitePagination<T>(
  fetchPage: (page: number) => Promise<PageResult<T>>,
) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const result = await fetchPage(nextPage)

      setItems((prev) => [...prev, ...result.items])
      setPage(nextPage)

      if (result.totalPages !== undefined) {
        setHasMore(nextPage < result.totalPages)
      } else {
        setHasMore(result.items.length > 0)
      }
    } catch (error) {
      console.error('Error loading more items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchPage, page, isLoading, hasMore])

  const reset = useCallback((options: ResetOptions<T> = {}) => {
    setItems(options.items ?? [])
    setPage(options.page ?? 1)
    setHasMore(options.hasMore ?? true)
  }, [])

  return { items, loadMore, isLoading, hasMore, setItems, reset }
}
