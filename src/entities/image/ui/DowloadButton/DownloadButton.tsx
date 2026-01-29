'use client'

import IconDown from '@/shared/assets/icons/down arrow.svg'
import Button from '@/shared/ui/Button'
import { downloadPhoto } from '@/shared/lib/actions'

type DownloadButtonProps = {
  imageUrl: string
  logUrl: string
}

const DownloadButton = (props: DownloadButtonProps) => {
  const { imageUrl, logUrl } = props

  return (
    <Button
      label="Download"
      href={imageUrl}
      icon={IconDown}
      download
      onClick={() => downloadPhoto(logUrl)}
    />
  )
}

export default DownloadButton
