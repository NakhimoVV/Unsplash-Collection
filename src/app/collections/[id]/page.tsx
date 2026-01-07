import { fetchPhotosFromCollectionById } from '@/app/lib/database'
import PageHeader from '@/shared/ui/PageHeader'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
  const photos = await fetchPhotosFromCollectionById(id)

  return (
    <div>
      {/*<PageHeader title={} subtitle={} />*/}
      {photos.map((photo) => {
        return (
          <div key={photo.id}>
            <img
              src={photo.urls.small}
              alt=""
              width="200"
              height="300"
              loading="lazy"
            />
          </div>
        )
      })}
    </div>
  )
}
