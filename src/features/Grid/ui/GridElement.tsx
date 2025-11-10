import styles from './GridElement.module.scss'
import { Result } from '@/shared/api/unsplash/model'
import { useBlurDataURL } from '@/shared/hooks/useBlurDataURL'
import Link from 'next/link'
import Image from 'next/image'

const GridElement = ({ image }: { image: Result }) => {
  const blurDataURL = useBlurDataURL(image.blur_hash)

  // Calc the correct dimensions to maintain proportions
  const aspectRatio = image.width / image.height
  const baseWidth = 400
  const calculatedHeight = Math.round(baseWidth / aspectRatio)

  return (
    <Link className={styles.imageWrapper} href={`/photos/${image.id}`}>
      <Image
        className={styles.image}
        src={image.urls.small}
        alt={image.description || `Photo by ${image.user.name}`}
        width={baseWidth}
        height={calculatedHeight}
        loading="lazy"
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    </Link>
  )
}

export default GridElement
