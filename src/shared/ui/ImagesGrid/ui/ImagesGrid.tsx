import styles from './ImagesGrid.module.scss'
import Image from 'next/image'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

type ImagesGridProps = {
  query: string
  currentPage: number
}

async function getPhotosByQuery(query: string, currentPage: number) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${currentPage}&per_page=3`,
    {
      headers: {
        'Accept-Version': 'v1',
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch photos')
  }

  return response.json()
}

const ImagesGrid = async (props: ImagesGridProps) => {
  const { query, currentPage } = props

  const data = (await getPhotosByQuery(
    query,
    currentPage,
  )) as UnsplashSearchResponse

  return (
    <div className={styles.imagesGrid}>
      {data.results.map((image) => (
        <Image
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
