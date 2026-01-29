import Image from 'next/image'
import { unsplashApi } from '@/shared/api/unsplash'
import { formatDate } from '@/shared/utils/formatDate'
import Button from '@/shared/ui/Button'
import IconPlus from '@/shared/assets/icons/Plus.svg'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import DownloadButton from '@/entities/image/ui/DowloadButton/DownloadButton'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id
  // TODO: type Image for data
  const data = await unsplashApi.getPhotoById(id)

  console.log(data)

  if (!data) {
    notFound()
  }

  // TODO: сделать клик по картинке и открыть в модалке во вьюпорте

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        {data && (
          <>
            <div className={styles.imageBox}>
              <Image
                className={styles.image}
                src={data.urls.regular}
                alt={data.alt_description}
                fill
                sizes={'(max-width: 768px) 50vw, 100vw'}
                loading="eager"
                priority
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
                  <DownloadButton
                    imageUrl={data.links.download}
                    logUrl={data.links.download_location}
                  />
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
