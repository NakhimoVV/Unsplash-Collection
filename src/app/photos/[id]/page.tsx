import styles from './page.module.scss'
import Image from 'next/image'
import { unsplashApi } from '@/shared/api/unsplash'
import { formatDate } from '@/shared/lib/formatDate'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id

  const data = await unsplashApi.getPhotoById(id)

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {data && (
          <>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={data.urls.regular}
                alt={data.slug}
                width={data.width}
                height={data.height}
              />
            </div>
            <div className={styles.rightSide}>
              <div>
                <div className={styles.headerProfile}>
                  <Image
                    className={styles.imageProfile}
                    src={data.user.profile_image.small}
                    alt=""
                    width={50}
                    height={50}
                  />
                  <span>{data.user.name}</span>
                </div>
                <p className={styles.subString}>
                  Published on{' '}
                  <time dateTime={data.created_at}>
                    {formatDate(data.created_at)}
                  </time>
                </p>
              </div>
              <p>Collections</p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
