import { createReadStream } from 'fs';
import { createId } from '@paralleldrive/cuid2';

interface FormidableFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
}

export async function uploadFormFile(
  file: FormidableFile,
  directory: string
): Promise<string> {
  const stream = createReadStream(file.filepath);
  const fileName = `${directory}/${createId()}-${file.originalFilename}`;
  return await uploadFile(stream, fileName, file.mimetype);
}

export function extractMinioKey(storedUrl: string): string {
  const config = useRuntimeConfig();
  const prefix = `${config.minioBaseUrl}/${config.minioBucket}`;
  if (storedUrl.startsWith(prefix)) {
    return storedUrl.slice(prefix.length);
  }
  return storedUrl;
}

export async function deleteStoredFile(storedUrl: string | null | undefined): Promise<void> {
  if (!storedUrl) return;
  const key = extractMinioKey(storedUrl);
  await deleteFile(key);
}
