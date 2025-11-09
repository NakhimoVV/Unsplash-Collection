import Search from '@/features/Search'
import ImagesGridWithInfiniteScroll from '@/shared/ui/ImagesGridWithInfiniteScroll'
import { unsplashApi } from '@/shared/api/unsplash'
import styles from './page.module.scss'

type SearchPageProps = {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const page = Number(searchParams?.page) || 1

  const initialData = await unsplashApi.getPhotosByQuery(query, page)

  return (
    <>
      <div className={styles.gradientLine}></div>
      <div className={styles.searchContainer}>
        <Search placeholder="Enter your keywords..." />
      </div>
      <div className={styles.container}>
        {query && (
          <ImagesGridWithInfiniteScroll
            query={query}
            initialData={initialData}
            initialPage={page}
          />
        )}
      </div>
    </>
  )
}
