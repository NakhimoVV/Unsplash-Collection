import CollectionItem from '@/entities/collection/ui/CollectionItem'

import type { Collection } from '@/entities/collection/model/types'
import type { ReactNode } from 'react'

import styles from './CollectionList.module.scss'

type CollectionListProps = {
  children?: ReactNode
  items: Collection[]
  renderItemAction?: (item: Collection) => ReactNode
}

const CollectionList = (props: CollectionListProps) => {
  const { items, children, renderItemAction } = props

  return (
    <ul className={styles.collectionList}>
      {items.map((item, index) => (
        <CollectionItem
          action={renderItemAction?.(item)}
          isAboveFold={index === 0}
          key={item.id}
          item={item}
        />
      ))}
      {children}
    </ul>
  )
}

export default CollectionList
