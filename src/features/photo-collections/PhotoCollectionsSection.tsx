'use client'

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'

import IconPlus from '@/shared/assets/icons/Plus.svg'
import IconRemove from '@/shared/assets/icons/Remove.svg'
import IconSearch from '@/shared/assets/icons/Search.svg'
import {
  addPhotoToCollection,
  removePhotoFromCollection,
} from '@/shared/lib/actions'

import { filterCollections } from './lib/filterCollections'

import type { PhotoCollection } from './model/types'
import type { ReactNode } from 'react'

import styles from './PhotoCollectionsSection.module.scss'

type PhotoCollectionsSectionProps = {
  children: ReactNode
  collections: PhotoCollection[]
  photoId: string
}

type CollectionAction = 'add' | 'remove'

const PhotoCollectionsSection = (props: PhotoCollectionsSectionProps) => {
  const { children, collections, photoId } = props
  const router = useRouter()
  const searchId = useId()
  const statusId = useId()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(collections)
  const [error, setError] = useState<string | null>(null)
  const [pendingCollectionId, setPendingCollectionId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    setItems(collections)
  }, [collections])

  const visibleCollections = filterCollections(items, query)
  const matchesLabel = `${visibleCollections.length} ${
    visibleCollections.length === 1 ? 'match' : 'matches'
  }`

  const updateCollection = (collectionId: string, action: CollectionAction) => {
    setItems((currentItems) =>
      currentItems.map((collection) => {
        if (collection.id !== collectionId) {
          return collection
        }

        const countDelta = action === 'add' ? 1 : -1

        return {
          ...collection,
          count_images: Math.max(0, collection.count_images + countDelta),
          hasCurrentPhoto: action === 'add',
        }
      }),
    )
  }

  const handleCollectionAction = (
    collectionId: string,
    action: CollectionAction,
  ) => {
    setError(null)
    setPendingCollectionId(collectionId)

    void (async () => {
      try {
        if (action === 'add') {
          await addPhotoToCollection(collectionId, photoId)
        } else {
          await removePhotoFromCollection(collectionId, photoId)
        }

        updateCollection(collectionId, action)
        router.refresh()
      } catch {
        setError('Unable to update collection. Please try again.')
      } finally {
        setPendingCollectionId(null)
      }
    })()
  }

  const renderCollection = (
    collection: PhotoCollection,
    isDialogItem = false,
  ) => {
    const action: CollectionAction = collection.hasCurrentPhoto
      ? 'remove'
      : 'add'
    const isCurrentActionPending = pendingCollectionId === collection.id
    const shouldRenderAction =
      (!collection.hasCurrentPhoto || !collection.isCurrentPhotoSystem) &&
      (collection.hasCurrentPhoto || isDialogItem)

    return (
      <li
        className={clsx(
          styles.collectionItem,
          collection.hasCurrentPhoto && styles.collectionItemActive,
        )}
        key={collection.id}
      >
        <div className={styles.collectionPreview} aria-hidden="true">
          {collection.preview_images[0] ? (
            <Image
              className={styles.collectionImage}
              src={collection.preview_images[0]}
              fill
              sizes="60px"
              alt=""
            />
          ) : (
            <span className={styles.collectionImageFallback} />
          )}
        </div>
        <div className={styles.collectionText}>
          <span className={styles.collectionTitle}>{collection.name}</span>
          <span className={styles.collectionMeta}>
            {collection.count_images} photos
          </span>
        </div>
        {shouldRenderAction && (
          <button
            className={clsx(
              styles.inlineAction,
              (action === 'remove' || isDialogItem) &&
                styles.inlineActionVisible,
            )}
            disabled={isCurrentActionPending}
            onClick={() => handleCollectionAction(collection.id, action)}
            type="button"
          >
            {action === 'add' ? (
              <IconPlus aria-hidden="true" width={16} height={16} />
            ) : (
              <IconRemove aria-hidden="true" width={16} height={16} />
            )}
            <span>{action === 'add' ? 'Add to Collection' : 'Remove'}</span>
          </button>
        )}
      </li>
    )
  }

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className={styles.root} aria-describedby={statusId}>
        <div className={styles.actions}>
          <Dialog.Trigger asChild>
            <button className={styles.trigger} type="button">
              <IconPlus aria-hidden="true" width={16} height={16} />
              <span>Add to Collection</span>
            </button>
          </Dialog.Trigger>
          {children}
        </div>
        <div className={styles.header}>
          <h2 className={styles.title}>Collections</h2>
        </div>

        {items.length > 0 ? (
          <ul className={styles.collectionList}>
            {items.map((collection) => renderCollection(collection))}
          </ul>
        ) : (
          <p className={styles.emptyState}>No collections yet.</p>
        )}

        <p
          className={styles.status}
          id={statusId}
          aria-live="polite"
          role={error ? 'alert' : undefined}
        >
          {error}
        </p>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.overlay}
          onClick={() => setIsDialogOpen(false)}
        />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.dialogTitle}>
            Add to Collections
          </Dialog.Title>
          <Dialog.Description className="visually-hidden">
            Search your collections and add or remove this photo.
          </Dialog.Description>
          <div className={styles.searchBox}>
            <label className="visually-hidden" htmlFor={searchId}>
              Search collections
            </label>
            <input
              className={styles.searchInput}
              id={searchId}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search collections"
              type="search"
              value={query}
            />
            <IconSearch
              aria-hidden="true"
              className={styles.searchIcon}
              width={24}
              height={24}
            />
          </div>
          <p className={styles.matches}>{matchesLabel}</p>
          {visibleCollections.length > 0 ? (
            <ul className={styles.dialogList}>
              {visibleCollections.map((collection) =>
                renderCollection(collection, true),
              )}
            </ul>
          ) : (
            <p className={styles.emptyState}>No matching collections.</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PhotoCollectionsSection
