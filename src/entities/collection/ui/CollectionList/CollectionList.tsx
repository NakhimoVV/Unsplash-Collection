import CollectionItem from '@/entities/collection/ui/CollectionItem'

import type { Collection } from '@/entities/collection/model/types'

import styles from './CollectionList.module.scss'

type CollectionListProps = {
  items: Collection[]
}

const CollectionList = (props: CollectionListProps) => {
  const { items } = props

  return (
    <ul className={styles.collectionList}>
      {items.map((item, index) => (
        <CollectionItem isAboveFold={index === 0} key={item.id} item={item} />
      ))}
    </ul>
  )
}

export default CollectionList
