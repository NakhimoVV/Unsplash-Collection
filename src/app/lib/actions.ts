'use server'

import { UnsplashSearchResponse } from '@/shared/api/unsplash/model'
import { unsplashApi } from '@/shared/api/unsplash'
import { fetchImagesFromCollectionById } from '@/app/lib/database'

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
