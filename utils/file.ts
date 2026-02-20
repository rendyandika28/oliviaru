export const fileToUrl = (file: File | string | null | undefined): string => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  return URL.createObjectURL(file);
};

export const loadAssetStorage = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.includes('blob:')) return url;
  const { minioBaseUrl } = useRuntimeConfig().public;
  return `${minioBaseUrl}/${url}`;
};
