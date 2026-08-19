import AddCollection from '@/features/add-collection'
import RemoveCollection from '@/features/remove-collection'
import CollectionList from '@/entities/collection/ui/CollectionList'
import { fetchCollections } from '@/shared/lib/database'
import PageHeader from '@/shared/ui/PageHeader'

import styles from './page.module.scss'

const title = 'Collections'

export default async function Page() {
  const collections = await fetchCollections()

  const subtitle = (
    <>
      Explore the world through collections of beautiful photos free to use
      under the{' '}
      <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
        Unsplash License
      </a>
      .
    </>
  )

  return (
    <div className={styles.pageContainer}>
      <PageHeader title={title} subtitle={subtitle} />
      <CollectionList
        items={collections}
        renderItemAction={(collection) =>
          collection.is_system ? null : (
            <RemoveCollection id={collection.id} name={collection.name} />
          )
        }
      >
        <AddCollection />
      </CollectionList>
    </div>
  )
}
