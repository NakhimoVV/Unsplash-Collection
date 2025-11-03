import Hero from '@/widgets/Hero'
import ImagesGrid from '@/shared/ui/ImagesGrid'

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

  return (
    <>{query ? <ImagesGrid query={query} currentPage={page} /> : <Hero />}</>
  )
}
