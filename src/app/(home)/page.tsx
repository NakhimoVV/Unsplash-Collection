import Hero from '@/widgets/Hero'
import SearchList from '@/features/Search/ui/SearchList'

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

  return <>{query ? <SearchList query={query} page={page} /> : <Hero />}</>
}
