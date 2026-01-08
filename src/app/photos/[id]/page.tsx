import Image from 'next/image'
import { unsplashApi } from '@/shared/api/unsplash'
import { formatDate } from '@/shared/lib/formatDate'
import Button from '@/shared/ui/Button'
import IconPlus from '@/shared/assets/icons/Plus.svg'
import IconDown from '@/shared/assets/icons/down arrow.svg'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id

  const data = await unsplashApi.getPhotoById(id)

  if (!data) {
    notFound()
    // TODO: сделать страницу 404
  }

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        {data && (
          <>
            <div className={styles.imageBox}>
              <Image
                className={styles.image}
                src={data.urls.regular}
                alt={data.slug}
                width={data.width}
                height={data.height}
              />
            </div>
            <div className={styles.aboutBox}>
              <div className={styles.photoInfo}>
                <header className={styles.dataCreator}>
                  <Image
                    className={styles.userpic}
                    src={data.user.profile_image.medium}
                    alt=""
                    width={50}
                    height={50}
                  />
                  <span>{data.user.name}</span>
                </header>
                <p className={styles.createdDate}>
                  Published on{' '}
                  <time dateTime={data.created_at}>
                    {formatDate(data.created_at)}
                  </time>
                </p>
                <div className={styles.actions}>
                  <Button label="Add to Collection" icon={IconPlus} />
                  <Button label="Download" icon={IconDown} />
                </div>
              </div>
              <div className={styles.photoCollections}>Collections</div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
