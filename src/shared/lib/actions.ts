'use server'

import { revalidatePath } from 'next/cache'

import { unsplashApi } from '@/shared/api/unsplash'
import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import {
  addImageToCollection,
  createCollection as createCollectionRecord,
  deleteCollection as deleteCollectionRecord,
  fetchImagesFromCollectionById,
  removeImageFromCollection,
} from '@/shared/lib/database'

/**
 * Server Actions
 */

export async function loadPhotos(
  query: string,
  page: number,
): Promise<UnsplashSearchResponse> {
  if (!query || query.trim() === '') {
    throw new Error('Query is required for load photos')
  }

  if (page < 1) {
    throw new Error('Page must be greater than 0')
  }

  return await unsplashApi.getPhotosByQuery(query, page)
}

export async function loadCollectionPhotos(id: string, page: number) {
  return fetchImagesFromCollectionById(id, page)
}

export async function downloadPhoto(url: string) {
  return unsplashApi.getFilePhoto(url)
}

export async function createCollection(name: string) {
  const normalizedName = name.trim()

  if (!normalizedName) {
    throw new Error('Collection name is required')
  }

  await createCollectionRecord(normalizedName)
  revalidatePath('/collections')
}

export async function deleteCollection(id: string) {
  if (!id.trim()) {
    throw new Error('Collection id is required')
  }

  await deleteCollectionRecord(id)
  revalidatePath('/collections')
}

export async function addPhotoToCollection(
  collectionId: string,
  photoId: string,
) {
  const photo = await unsplashApi.getPhotoById(photoId)

  await addImageToCollection(collectionId, photo)
}

export async function removePhotoFromCollection(
  collectionId: string,
  photoId: string,
) {
  await removeImageFromCollection(collectionId, photoId)
}
