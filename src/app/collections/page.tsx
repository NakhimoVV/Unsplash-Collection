import { fetchCollections } from '@/app/lib/database'
import CollectionList from '@/entities/collection/ui/CollectionList'
import styles from './Page.module.scss'

export default async function Page() {
  const collections = await fetchCollections()

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Collections</h3>
      <CollectionList items={collections} />
    </div>
  )
}
