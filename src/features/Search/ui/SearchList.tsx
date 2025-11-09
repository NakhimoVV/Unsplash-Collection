import styles from './SearchList.module.scss'
import Search from '@/features/Search'
import ImagesGridWithInfiniteScroll from '@/shared/ui/ImagesGridWithInfiniteScroll'
import { unsplashApi } from '@/shared/api/unsplash'

type SearchListProps = {
  query: string
  page: number
}

const SearchList = async (props: SearchListProps) => {
  const { query, page } = props
  const titleId = 'search-title'

  const initialData = await unsplashApi.getPhotosByQuery(query, page)

  return (
    <section aria-labelledby={titleId}>
      <h1 className="visually-hidden" id={titleId}>
        {query}
      </h1>
      <div className={styles.gradientLine}></div>
      <div className={styles.searchContainer}>
        <Search placeholder="Enter your keywords..." />
      </div>
      <div className={styles.container}>
        <ImagesGridWithInfiniteScroll
          query={query}
          initialData={initialData}
          initialPage={page}
        />
      </div>
    </section>
  )
}

export default SearchList
