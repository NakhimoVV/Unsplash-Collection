type CollectionName = Readonly<{
  name: string
}>

export function filterCollections<TCollection extends CollectionName>(
  collections: readonly TCollection[],
  query: string,
): TCollection[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return [...collections]
  }

  return collections.filter((collection) =>
    collection.name.toLowerCase().includes(normalizedQuery),
  )
}
