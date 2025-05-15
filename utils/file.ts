export const fileToUrl = (file: File | string) => {
  if (typeof file === 'string') return file
  return URL.createObjectURL(file);
}

export const loadAssetStorage = (url: string) => {
  if (url.includes('blob:')) return url // handle if url is blob
  const { minioBaseUrl } = useRuntimeConfig().public
  return `${minioBaseUrl}/${url}`
}
