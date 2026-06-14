import CollectionImages from '@/features/CollectionImages'
import {
  fetchCollectionById,
  fetchImagesFromCollectionById,
} from '@/shared/lib/database'
import PageHeader from '@/shared/ui/PageHeader'

import styles from './page.module.scss'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const { images, totalCount } = await fetchImagesFromCollectionById(id, 1)
  const collection = await fetchCollectionById(id)

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title={collection.name}
        subtitle={`${collection.count_images} photos`}
      />
      <CollectionImages initialItems={images} id={id} totalCount={totalCount} />
    </div>
  )
}
