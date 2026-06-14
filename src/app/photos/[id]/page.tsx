import NextImage from 'next/image'

import DownloadButton from '@/features/image-download'
import { fromUnsplashPhoto } from '@/entities/image/model/mappers/fromUnsplash'
import { unsplashApi } from '@/shared/api/unsplash'
import IconPlus from '@/shared/assets/icons/Plus.svg'
import Button from '@/shared/ui/Button'
import { formatDate } from '@/shared/utils/formatDate'

import styles from './page.module.scss'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id
  const photo = fromUnsplashPhoto(await unsplashApi.getPhotoById(id))

  return (
    <section>
      <div className={styles.inner}>
        <div className={styles.imageBox}>
          <NextImage
            className={styles.image}
            src={photo.urls.regular}
            alt={
              photo.altDescription ??
              photo.description ??
              `Photo by ${photo.user.name}`
            }
            fill
            sizes={'(max-width: 768px) 50vw, 100vw'}
            loading="eager"
            priority
          />
        </div>
        <div className={styles.aboutBox}>
          <div className={styles.photoInfo}>
            <header className={styles.dataCreator}>
              <NextImage
                className={styles.userpic}
                src={photo.user.profile_image.medium}
                alt=""
                width={50}
                height={50}
              />
              <span>{photo.user.name}</span>
            </header>
            <p className={styles.createdDate}>
              Published on{' '}
              <time dateTime={photo.created_at}>
                {formatDate(photo.created_at)}
              </time>
            </p>
            <div className={styles.actions}>
              <Button label="Add to Collection" icon={IconPlus} />
              <DownloadButton
                imageUrl={photo.urls.full}
                logUrl={photo.links.downloadLocation}
              />
            </div>
          </div>
          <div className={styles.photoCollections}>Collections</div>
        </div>
      </div>
    </section>
  )
}
