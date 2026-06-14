'use client'

import { MouseEventHandler } from 'react'

import { forceImageDownload } from '@/features/image-download/lib/forceImageDownload'
import IconDown from '@/shared/assets/icons/down arrow.svg'
import { downloadPhoto } from '@/shared/lib/actions'
import Button from '@/shared/ui/Button'

const DOWNLOAD_FILE_NAME = 'unsplash-photo.jpg'

type DownloadButtonProps = {
  imageUrl: string
  logUrl: string
}

const DownloadButton = (props: DownloadButtonProps) => {
  const { imageUrl, logUrl } = props
  const handleClick: MouseEventHandler<
    HTMLAnchorElement | HTMLButtonElement
  > = async (event) => {
    event.preventDefault()
    void downloadPhoto(logUrl)
    await forceImageDownload({
      fileName: DOWNLOAD_FILE_NAME,
      url: imageUrl,
    })
  }

  return (
    <Button
      label="Download"
      href={imageUrl}
      icon={IconDown}
      download
      onClick={handleClick}
    />
  )
}

export default DownloadButton
