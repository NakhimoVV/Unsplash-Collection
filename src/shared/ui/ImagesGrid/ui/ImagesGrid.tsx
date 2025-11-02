import styles from './ImagesGrid.module.scss'
import Image from 'next/image'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

type ImagesGridProps = {
  query?: string
  currentPage?: number
  data?: any
}

const ImagesGrid = (props: ImagesGridProps) => {
  const { data } = props

  return (
    <div className={styles.imagesGrid}>
      {data.results.map((image) => (
        <Image
          key={image.id}
          src={image.urls.small}
          alt={image.description || `Photo by ${image.user.name}`}
          width={400}
          height={500}
          loading="lazy"
        />
      ))}
    </div>
  )
}

export default ImagesGrid
