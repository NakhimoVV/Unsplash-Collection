'use client'

import { FormEventHandler, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'

import IconPlus from '@/shared/assets/icons/Plus.svg'
import { createCollection } from '@/shared/lib/actions'
import Button from '@/shared/ui/Button'

import styles from './AddCollection.module.scss'

const AddCollection = () => {
  const router = useRouter()
  const inputId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const normalizedName = name.trim()

    if (!normalizedName) {
      setError('Enter a collection name.')
      return
    }

    setError(null)
    setIsPending(true)

    void (async () => {
      try {
        await createCollection(normalizedName)
        setName('')
        setIsOpen(false)
        router.refresh()
      } catch {
        setError('Unable to create collection. Please try again.')
      } finally {
        setIsPending(false)
      }
    })()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <li className={styles.collection}>
        <Button
          icon={IconPlus}
          label="Add new collection"
          onClick={() => setIsOpen(true)}
          variant="large"
        />
      </li>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Add Collection</Dialog.Title>
          <Dialog.Description className="visually-hidden">
            Create a new collection.
          </Dialog.Description>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor={inputId}>
              Collection name
            </label>
            <input
              autoFocus
              className={styles.input}
              disabled={isPending}
              id={inputId}
              onChange={(event) => {
                setName(event.target.value)
                setError(null)
              }}
              placeholder="Enter a name for the new collection"
              type="text"
              value={name}
            />
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <div className={styles.actions}>
              <button
                className={styles.saveButton}
                disabled={isPending}
                type="submit"
              >
                Save
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
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddCollection
