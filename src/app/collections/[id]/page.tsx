import {
  fetchCollectionById,
  fetchPhotosFromCollectionById,
} from '@/app/lib/database'
import PageHeader from '@/shared/ui/PageHeader'
import styles from './page.module.scss'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const photos = await fetchPhotosFromCollectionById(id)
  const collection = await fetchCollectionById(id)

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title={collection.name}
        subtitle={`${collection.count_images} photos`}
      />
      {photos.map((photo) => {
        return (
          <div key={photo.id}>
            <img
              src={photo.urls.small}
              alt=""
              width="200"
              height="300"
              loading="lazy"
            />
          </div>
        )
      })}
    </div>
  )
}
