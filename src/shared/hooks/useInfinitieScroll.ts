import { useEffect, useRef } from 'react'

type InfinitieScrollProp = {
  action: () => Promise<void>
  canLoad: boolean
  threshold?: number
}

const useInfinitieScroll = (props: InfinitieScrollProp) => {
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

export default useInfinitieScroll
