import { useEffect, useState } from 'react'

import { blurHashToDataURL } from '@/shared/utils/blurhash'

/**
 * Хук для декодирования blur_hash в DataURL
 */
export function useBlurDataURL(
  blurHash: string | null | undefined,
): string | undefined {
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  useEffect(() => {
    setBlurDataURL(undefined)

    if (!blurHash) {
      return
    }

    setBlurDataURL(blurHashToDataURL(blurHash))
  }, [blurHash])

  return blurDataURL
}
