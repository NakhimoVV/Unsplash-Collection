import { useEffect, useRef } from 'react'

interface InfinitieScrollProp {
  action: () => Promise<void>
  dependency: boolean
}

const useInfinitieScroll = ({ action, dependency }: InfinitieScrollProp) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  // TODO: улучшить
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && dependency) {
          action()
        }
      },
      { threshold: 0.1 },
    )

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [action, dependency])

  return { lastElementRef }
}

export default useInfinitieScroll
