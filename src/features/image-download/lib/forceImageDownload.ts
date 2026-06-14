type ImageDownloadFetcher = (url: string) => Promise<{
  blob: () => Promise<Blob>
}>

type ImageDownloadDocument = Pick<Document, 'createElement'> &
  Readonly<{
    body: Pick<Document['body'], 'append'>
  }>

type ImageDownloadUrlApi = Pick<
  typeof URL,
  'createObjectURL' | 'revokeObjectURL'
>

type ForceImageDownloadParams = Readonly<{
  documentRef?: ImageDownloadDocument
  fetcher?: ImageDownloadFetcher
  fileName: string
  url: string
  urlApi?: ImageDownloadUrlApi
}>

export async function forceImageDownload(
  params: ForceImageDownloadParams,
): Promise<void> {
  const documentRef: ImageDownloadDocument = params.documentRef ?? document
  const fetcher = params.fetcher ?? fetch
  const urlApi = params.urlApi ?? URL
  const response = await fetcher(params.url)
  const blob = await response.blob()
  const objectUrl = urlApi.createObjectURL(blob)
  const link = documentRef.createElement('a')

  link.href = objectUrl
  link.download = params.fileName
  documentRef.body.append(link)
  link.click()
  link.remove()
  urlApi.revokeObjectURL(objectUrl)
}
