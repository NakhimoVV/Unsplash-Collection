import NextImage from 'next/image'

import DownloadButton from '@/features/image-download'
import PhotoCollectionsSection from '@/features/photo-collections'
import { fromUnsplashPhoto } from '@/entities/image/model/mappers/fromUnsplash'
import { unsplashApi } from '@/shared/api/unsplash'
import { fetchCollectionsWithPhotoMembership } from '@/shared/lib/database'
import { formatDate } from '@/shared/utils/formatDate'

import styles from './page.module.scss'

type PhotoPageProps = {
  params: Promise<{ id: string }>
}

export default async function Photo(props: PhotoPageProps) {
  const params = await props.params
  const id = params.id
  const photo = fromUnsplashPhoto(await unsplashApi.getPhotoById(id))
  const collections = await fetchCollectionsWithPhotoMembership(id)
  const photoCollections = collections.map(
    ({ has_current_photo: hasCurrentPhoto, ...collection }) => ({
      ...collection,
      hasCurrentPhoto,
    }),
  )

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
          </div>
          <PhotoCollectionsSection
            collections={photoCollections}
            photoId={photo.id}
          >
            <DownloadButton
              imageUrl={photo.urls.full}
              logUrl={photo.links.downloadLocation}
            />
          </PhotoCollectionsSection>
        </div>
      </div>
    </section>
  )
}
