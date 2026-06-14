import Image from 'next/image'
import Link from 'next/link'

import type { Collection } from '@/entities/collection/model/types'

import styles from './CollectionItem.module.scss'

type CollectionItemProps = {
  item: Collection
}

const CollectionItem = (props: CollectionItemProps) => {
  const { item } = props

  return (
    <li className={styles.collection}>
      <Link className={styles.link} href={`/collections/${item.id}`}>
        <header
          className={styles.header}
          data-preview-count={item.preview_images.length}
        >
          {item.preview_images.map((imgSrc) => (
            <div className={styles.imageWrapper} key={imgSrc}>
              <Image
                className={styles.image}
                src={imgSrc}
                fill
                sizes="360px"
                alt=""
              />
            </div>
          ))}
        </header>
        <footer className={styles.footer}>
          <h4 className={styles.title}>{item.name}</h4>
          <p className={styles.subtitle}>{item.count_images} photos</p>
        </footer>
      </Link>
    </li>
  )
}

export default CollectionItem
