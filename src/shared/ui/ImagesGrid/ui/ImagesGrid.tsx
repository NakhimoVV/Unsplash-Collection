import styles from './ImagesGrid.module.scss'
import Image from 'next/image'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { unsplashApi } from '@/shared/api/unsplash'

type ImagesGridProps = {
  query: string
  currentPage: number
}

const ImagesGrid = async (props: ImagesGridProps) => {
  const { query, currentPage } = props

  const data: UnsplashSearchResponse = await unsplashApi.getPhotosByQuery(
    query,
    currentPage,
  )

  return (
    <div className={styles.imagesGrid}>
      {data.results.map((image) => (
        <Image
          className={styles.image}
          key={image.id}
          src={image.urls.small}
          alt={image.description || `Photo by ${image.user.name}`}
          width={400}
          height={Math.round((400 / image.width) * image.height)}
          loading="lazy"
        />
      ))}
    </div>
  )
}

export default ImagesGrid
