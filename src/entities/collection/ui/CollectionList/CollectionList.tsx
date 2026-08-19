import CollectionItem from '@/entities/collection/ui/CollectionItem'

import type { Collection } from '@/entities/collection/model/types'
import type { ReactNode } from 'react'

import styles from './CollectionList.module.scss'

type CollectionListProps = {
  items: Collection[]
  children?: ReactNode
}

const CollectionList = (props: CollectionListProps) => {
  const { items, children } = props

  return (
    <ul className={styles.collectionList}>
      {items.map((item, index) => (
        <CollectionItem isAboveFold={index === 0} key={item.id} item={item} />
      ))}
      {children}
    </ul>
  )
}

export default CollectionList
