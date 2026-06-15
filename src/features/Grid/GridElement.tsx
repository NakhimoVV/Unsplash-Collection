import Image from 'next/image'
import Link from 'next/link'

import { Image as ImageType } from '@/entities/image/model/type'
import { useBlurDataURL } from '@/shared/hooks/useBlurDataURL'

import type { CSSProperties } from 'react'

import styles from './GridElement.module.scss'

type GridElementProps = {
  image: ImageType
  isAboveFold?: boolean
}

type BlurPlaceholderStyle = CSSProperties &
  Partial<Record<'--blur-data-url', string>>

const GridElement = (props: GridElementProps) => {
  const { image, isAboveFold = false } = props
  const blurDataURL = useBlurDataURL(image.blur_hash)
  const blurPlaceholderStyle: BlurPlaceholderStyle | undefined = blurDataURL
    ? { '--blur-data-url': `url("${blurDataURL}")` }
    : undefined

  // Calc the correct dimensions to maintain proportions
  const aspectRatio = image.width / image.height
  const baseWidth = 400
  const calculatedHeight = Math.round(baseWidth / aspectRatio)

  return (
    <Link
      className={styles.imageLink}
      href={`/photos/${image.id}`}
      style={blurPlaceholderStyle}
    >
      <Image
        className={styles.image}
        src={image.urls.small}
        alt={image.description || `Photo by ${image.user.name}`}
        width={baseWidth}
        height={calculatedHeight}
        loading={isAboveFold ? 'eager' : 'lazy'}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    </Link>
  )
}

export default GridElement
