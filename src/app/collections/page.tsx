export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { fetchCollections } from '@/app/lib/database'
import CollectionList from '@/entities/collection/ui/CollectionList'
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
      <CollectionList items={collections} />
    </div>
  )
}
