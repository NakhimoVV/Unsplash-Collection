/**
 * Утилита для работы с blur_hash
 * pnpm i blurhash
 */

/**
 * Конвертирует blur_hash в base64 изображение для использования в Next.js Image
 * @param blurHash - blur_hash строка из Unsplash API
 * @param width - ширина изображения (по умолчанию 32px для производительности)
 * @param height - высота изображения (по умолчанию 32px)
 * @returns base64 строка для использования в blurDataURL
 */
export async function blurHashToDataURL(
  blurHash: string | null | undefined,
  width: number = 32,
  height: number = 32,
): Promise<string | undefined> {
  if (!blurHash) {
    return undefined
  }

  // Работаем только на клиенте!
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    // Динамический импорт для работы только на клиенте
    const { decode } = await import('blurhash')
    const pixels = decode(blurHash, width, height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return undefined
    }

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL()
  } catch (error) {
    console.warn('Failed to decode blur_hash:', error)
    return undefined
  }
}
// TODO: не используемый код ?
/**
 * Синхронная версия (требует blurhash установленную)
 * Используется для предварительной генерации на сервере
 */
export function blurHashToDataURLSync(
  blurHash: string | null | undefined,
  width: number = 32,
  height: number = 32,
): string | undefined {
  if (!blurHash) {
    return undefined
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { decode } = require('blurhash')
    const pixels = decode(blurHash, width, height)

    // Для сервера нужен node-canvas или другой подход
    // Здесь пока возвращаем undefined, так как на сервере нужен canvas
    return undefined
  } catch (error) {
    return undefined
  }
}
