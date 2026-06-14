import { useEffect, useState } from 'react'

import { blurHashToDataURL } from '@/shared/utils/blurhash'

/**
 * Хук для декодирования blur_hash в base64 DataURL
 * Работает только на клиенте
 */
export function useBlurDataURL(
  blurHash: string | null | undefined,
): string | undefined {
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!blurHash) {
      setBlurDataURL(undefined)
      return
    }

    blurHashToDataURL(blurHash)
      .then((dataURL) => {
        setBlurDataURL(dataURL)
      })
      .catch(() => {
        setBlurDataURL(undefined)
      })
  }, [blurHash])

  return blurDataURL
}
