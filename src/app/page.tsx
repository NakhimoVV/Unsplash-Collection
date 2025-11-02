import styles from './ui/Home.module.scss'
import Hero from '@/widgets/Hero'
import ImagesGrid from '@/shared/ui/ImagesGrid'
import { unsplashApi } from '@/shared/api/unsplash'
import { Suspense } from 'react'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'

// type HomeProps = {
//   searchParams?: Promise<{
//     query?: string
//     page?: string
//   }>
// }

export default async function Home({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string }
}) {
  const query = searchParams?.query || 'nature'
  const page = Number(searchParams?.page) || 1

  // const data = await unsplashApi.searchPhotos(query, currentPage)
  // TODO: Надо попробовать Поменять пропсы!
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=3`,
    {
      headers: {
        'Accept-Version': 'v1',
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  )
  const data = await response.json

  return (
    <main className={styles.home}>
      <Hero />
      <Suspense fallback={<p>Loading...</p>}>
        <ImagesGrid data={data.results} />
      </Suspense>
    </main>
  )
}
