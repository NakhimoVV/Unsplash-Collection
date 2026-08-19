'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'

import IconRemove from '@/shared/assets/icons/Remove.svg'
import { deleteCollection } from '@/shared/lib/actions'

import styles from './RemoveCollection.module.scss'

type RemoveCollectionProps = {
  id: string
  name: string
}

const RemoveCollection = (props: RemoveCollectionProps) => {
  const { id, name } = props
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      setError(null)
    }
  }

  const handleDelete = () => {
    setError(null)
    setIsPending(true)

    void (async () => {
      try {
        await deleteCollection(id)
        setIsOpen(false)
        router.refresh()
      } catch {
        setError('Unable to delete collection. Please try again.')
      } finally {
        setIsPending(false)
      }
    })()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Delete collection"
          className={styles.trigger}
          title="Delete collection"
          type="button"
        >
          <IconRemove aria-hidden="true" width={16} height={16} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            Delete collection?
          </Dialog.Title>
          <Dialog.Description className={styles.description}>
            Collection “{name}” and all of its photos will be permanently
            removed.
          </Dialog.Description>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.actions}>
            <button
              className={styles.deleteButton}
              disabled={isPending}
              onClick={handleDelete}
              type="button"
            >
              Delete
            </button>
            <Dialog.Close asChild>
              <button
                className={styles.cancelButton}
                disabled={isPending}
                type="button"
              >
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default RemoveCollection
