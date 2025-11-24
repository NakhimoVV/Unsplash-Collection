import { useEffect, useRef } from 'react'

type InfiniteScrollProp = {
  action: () => Promise<void>
  canLoad: boolean
  threshold?: number
}

export const useInfiniteScroll = (props: InfiniteScrollProp) => {
  const { action, canLoad, threshold = 0.1 } = props

  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  const cleanup = () => {
    observerRef.current?.disconnect()
  }

  useEffect(() => {
    cleanup()

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && canLoad) {
          void action()
        }
      },
      { threshold },
    )
    observerRef.current = observer

    const lastElement = lastElementRef.current

    if (lastElement) {
      observer.observe(lastElement)
    }

    return cleanup
  }, [action, canLoad, threshold])

  return { lastElementRef }
}
