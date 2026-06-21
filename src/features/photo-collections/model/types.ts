import type { Collection } from '@/entities/collection/model/types'

export type PhotoCollection = Collection & {
  hasCurrentPhoto: boolean
}
