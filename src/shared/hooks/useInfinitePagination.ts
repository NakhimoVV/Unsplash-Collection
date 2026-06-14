import { useCallback, useRef, useState } from 'react'

import {
  readInfinitePaginationCache,
  writeInfinitePaginationCache,
} from '@/shared/lib/infinitePaginationCache'

type PageResult<T> = {
  items: T[]
  totalPages?: number
}

type ResetOptions<T> = {
  items?: T[]
  page?: number
  hasMore?: boolean
}

type PaginationState<T> = {
  items: T[]
  page: number
  isLoading: boolean
  hasMore: boolean
}

type UseInfinitePaginationOptions = {
  cacheKey?: string
}

export function useInfinitePagination<T>(
  fetchPage: (page: number) => Promise<PageResult<T>>,
  options: UseInfinitePaginationOptions = {},
) {
  const { cacheKey } = options
  const [state, setState] = useState<PaginationState<T>>({
    items: [],
    page: 1,
    isLoading: false,
    hasMore: true,
  })
  const stateRef = useRef(state)

  const updateState = useCallback((nextState: PaginationState<T>) => {
    stateRef.current = nextState
    setState(nextState)
  }, [])

  const loadMore = useCallback(async () => {
    const currentState = stateRef.current

    if (currentState.isLoading || !currentState.hasMore) {
      return
    }

    updateState({ ...currentState, isLoading: true })
    try {
      const nextPage = currentState.page + 1
      const result = await fetchPage(nextPage)
      const latestState = stateRef.current
      const nextItems = [...latestState.items, ...result.items]
      const nextHasMore =
        result.totalPages !== undefined
          ? nextPage < result.totalPages
          : result.items.length > 0

      const nextState = {
        items: nextItems,
        page: nextPage,
        isLoading: false,
        hasMore: nextHasMore,
      }

      updateState(nextState)

      if (cacheKey) {
        writeInfinitePaginationCache(cacheKey, {
          items: nextItems,
          page: nextPage,
          hasMore: nextHasMore,
        })
      }
    } catch (error) {
      console.error('Error loading more items:', error)
      updateState({ ...stateRef.current, isLoading: false })
    }
  }, [fetchPage, cacheKey, updateState])

  const reset = useCallback(
    (resetOptions: ResetOptions<T> = {}) => {
      const resetPage = resetOptions.page ?? 1
      const cachedState = cacheKey
        ? readInfinitePaginationCache<T>(cacheKey)
        : null
      const nextState =
        cachedState && cachedState.page >= resetPage
          ? cachedState
          : {
              items: resetOptions.items ?? [],
              page: resetPage,
              hasMore: resetOptions.hasMore ?? true,
            }

      updateState({
        ...nextState,
        isLoading: false,
      })

      if (cacheKey) {
        writeInfinitePaginationCache(cacheKey, nextState)
      }
    },
    [cacheKey, updateState],
  )

  return {
    items: state.items,
    loadMore,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    setItems: (items: T[]) => updateState({ ...stateRef.current, items }),
    reset,
  }
}
