import styles from './CollectionItem.module.scss'
import type { Collection } from '@/entities/collection/model/types'
import Link from 'next/link'

type CollectionItemProps = {
  item: Collection
}

const CollectionItem = (props: CollectionItemProps) => {
  const { item } = props

  return (
    <li className={styles.collerctionItem}>
      <Link className={styles.link} href={`/collections/${item.id}`}>
        <header className={styles.header}>
          <img
            src={item.preview_images[0]}
            alt=""
            width="200"
            height="200"
            loading="lazy"
          />
        </header>
        <footer className={styles.footer}>
          <h4>{item.name}</h4>
          <p>{item.count_images} photos</p>
        </footer>
      </Link>
    </li>
  )
}

export default CollectionItem
