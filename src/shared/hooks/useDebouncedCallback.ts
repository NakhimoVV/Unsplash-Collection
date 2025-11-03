import { useCallback, useRef } from 'react'

export default function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )

  return debouncedCallback
}
