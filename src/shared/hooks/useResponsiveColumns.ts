import { useEffect, useState } from 'react'

export const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const queries = [
      { media: `(max-width: 480.98px)`, value: 1 },
      { media: `(max-width: 767.98px)`, value: 2 },
      { media: `(max-width: 1023.98px)`, value: 3 },
    ]

    const mediaLists = queries.map(({ media, value }) => ({
      widthMediaQuery: window.matchMedia(media),
      value,
    }))

    const updateColumns = () => {
      const active = mediaLists.find(
        ({ widthMediaQuery }) => widthMediaQuery.matches,
      )
      if (active) {
        setColumns(active.value)
      } else {
        setColumns(4)
      }
    }

    updateColumns()

    mediaLists.forEach(({ widthMediaQuery }) =>
      widthMediaQuery.addEventListener('change', updateColumns),
    )

    return () => {
      mediaLists.forEach(({ widthMediaQuery }) =>
        widthMediaQuery.removeEventListener('change', updateColumns),
      )
    }
  }, [])

  return columns
}
