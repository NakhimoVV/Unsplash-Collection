import Hero from '@/widgets/Hero'
import SearchList from '@/features/Search/ui/SearchList'
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
    const initialData: UnsplashSearchResponse =
      await unsplashApi.getPhotosByQuery(query, page)

    return (
      <SearchList query={query} page={page} initialData={initialData.results} />
    )
  }

  return <Hero />
}
