import Hero from '@/widgets/Hero'
import SearchList from '@/features/Search/ui/SearchList'
import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { mapUnsplashResultToImageType } from '@/entities/image/lib/mapUnsplashResultToImageType'

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
    const initialData = initialResponse.results.map(
      mapUnsplashResultToImageType,
    )

    return <SearchList query={query} page={page} initialData={initialData} />
  }

  return <Hero />
}
