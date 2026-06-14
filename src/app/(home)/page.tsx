import Hero from '@/widgets/Hero'
import SearchList from '@/features/search/SearchList'
import { fromUnsplash } from '@/entities/image/model/mappers/fromUnsplash'
import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

type HomeProps = {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const page = Number(searchParams?.page) || 1

  if (query) {
    const initialResponse: UnsplashSearchResponse =
      await unsplashApi.getPhotosByQuery(query, page)
    const initialData = initialResponse.results.map(fromUnsplash)

    return (
      <SearchList
        query={query}
        page={page}
        initialData={initialData}
        totalPages={initialResponse.total_pages}
      />
    )
  }

  return <Hero />
}
