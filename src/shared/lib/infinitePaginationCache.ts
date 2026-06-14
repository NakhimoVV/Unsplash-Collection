const INFINITE_PAGINATION_CACHE_PREFIX = 'infinite-pagination:'

type InfinitePaginationCacheStorage = Pick<Storage, 'getItem' | 'setItem'>

export type InfinitePaginationCacheEntry<T> = {
  items: T[]
  page: number
  hasMore: boolean
}

function getStorage(
  storage?: InfinitePaginationCacheStorage,
): InfinitePaginationCacheStorage | null {
  if (storage) {
    return storage
  }

  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

function getInfinitePaginationCacheKey(cacheKey: string): string {
  return `${INFINITE_PAGINATION_CACHE_PREFIX}${cacheKey}`
}

function isCacheEntry<T>(
  data: unknown,
): data is InfinitePaginationCacheEntry<T> {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const entry = data as Record<string, unknown>
  const page = entry.page

  return (
    Array.isArray(entry.items) &&
    typeof page === 'number' &&
    Number.isInteger(page) &&
    typeof entry.hasMore === 'boolean' &&
    page >= 1
  )
}

export function readInfinitePaginationCache<T>(
  cacheKey: string,
  storage?: InfinitePaginationCacheStorage,
): InfinitePaginationCacheEntry<T> | null {
  const resolvedStorage = getStorage(storage)

  if (!resolvedStorage) {
    return null
  }

  try {
    const value = resolvedStorage.getItem(
      getInfinitePaginationCacheKey(cacheKey),
    )

    if (!value) {
      return null
    }

    const data: unknown = JSON.parse(value)

    return isCacheEntry<T>(data) ? data : null
  } catch {
    return null
  }
}

export function writeInfinitePaginationCache<T>(
  cacheKey: string,
  entry: InfinitePaginationCacheEntry<T>,
  storage?: InfinitePaginationCacheStorage,
): void {
  const resolvedStorage = getStorage(storage)

  if (!resolvedStorage) {
    return
  }

  resolvedStorage.setItem(
    getInfinitePaginationCacheKey(cacheKey),
    JSON.stringify(entry),
  )
}
