import styles from './page.module.scss'
import Image from 'next/image'
import { unsplashApi } from '@/shared/api/unsplash'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id

  const data = await unsplashApi.getPhotoById(id)

  return (
    <section className={styles.page}>
      {data && (
        <>
          <Image
            src={data.urls.small}
            alt={data.slug}
            width={400}
            height={400}
          />
          <div className={styles.rightSide}>
            <p>Автор: {data.user.name}</p>
            <p>Дата публикации: {data.created_at}</p>
            <p>Collections</p>
          </div>
        </>
      )}
    </section>
  )
}
