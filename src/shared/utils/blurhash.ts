import { decode } from 'blurhash'

const DEFAULT_BLUR_WIDTH = 32
const DEFAULT_BLUR_HEIGHT = 32
const MIN_BLUR_DIMENSION = 1

/**
 * Конвертирует blur_hash в canvas DataURL для использования в Next.js Image.
 * @param blurHash - blur_hash строка из Unsplash API
 * @param width - ширина placeholder в пикселях
 * @param height - высота placeholder в пикселях
 * @returns data URL для использования в blurDataURL
 */
export function blurHashToDataURL(
  blurHash: string | null | undefined,
  width: number = DEFAULT_BLUR_WIDTH,
  height: number = DEFAULT_BLUR_HEIGHT,
): string | undefined {
  if (!blurHash || !isValidDimension(width) || !isValidDimension(height)) {
    return undefined
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined
  }

  try {
    const pixels = decode(blurHash, width, height)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    canvas.width = width
    canvas.height = height

    const imageData = context.createImageData(width, height)
    imageData.data.set(pixels)
    context.putImageData(imageData, 0, 0)

    return canvas.toDataURL()
  } catch (error) {
    console.warn('Failed to decode blur_hash:', error)
    return undefined
  }
}

function isValidDimension(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_BLUR_DIMENSION
}
