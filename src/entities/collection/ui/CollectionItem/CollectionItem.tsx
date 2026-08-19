import Image from 'next/image'
import Link from 'next/link'

import type { Collection } from '@/entities/collection/model/types'
import type { ReactNode } from 'react'

import styles from './CollectionItem.module.scss'

type CollectionItemProps = {
  action?: ReactNode
  item: Collection
  isAboveFold?: boolean
}

const CollectionItem = (props: CollectionItemProps) => {
  const { action, item, isAboveFold = false } = props

  return (
    <li className={styles.collection}>
      <Link className={styles.link} href={`/collections/${item.id}`}>
        <header
          className={styles.header}
          data-preview-count={item.preview_images.length}
        >
          {item.preview_images.map((imgSrc, imageIndex) => (
            <div className={styles.imageWrapper} key={imgSrc}>
              <Image
                className={styles.image}
                src={imgSrc}
                fill
                sizes="360px"
                alt=""
                loading={isAboveFold && imageIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </header>
      </Link>
      <footer className={styles.footer}>
        <Link className={styles.details} href={`/collections/${item.id}`}>
          <h4 className={styles.title}>{item.name}</h4>
          <p className={styles.subtitle}>{item.count_images} photos</p>
        </Link>
        {action}
      </footer>
    </li>
  )
}

export default CollectionItem
