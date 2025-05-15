// Configure S3 client for MinIO
import { Client } from 'minio';
import { Readable } from 'stream';

export const minioClient = new Client({
  endPoint: useRuntimeConfig().minioEndpoint || '',
  useSSL: Boolean(useRuntimeConfig().minioSSL) || false,
  accessKey: useRuntimeConfig().minioAccessKey || '',
  secretKey: useRuntimeConfig().minioSecretKey || '',
  region: useRuntimeConfig().minioRegion || 'us-east-1'
});

export const bucketName = useRuntimeConfig().minioBucket || '';

// Ensure bucket exists
const initializeBucket = async () => {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
    // Make the bucket public
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  }
};

// Initialize bucket on server start
initializeBucket().catch(console.error);

/**
 * Upload a file to MinIO
 * @param fileStream - The file stream to upload
 * @param fileName - The name to give the file in MinIO
 * @param contentType - The content type of the file
 * @returns - The URL of the uploaded file
 */
export const uploadFile = async (fileStream: Readable, fileName: string, contentType: string): Promise<string> => {
  await minioClient.putObject(bucketName, fileName, fileStream, undefined, {
    'Content-Type': contentType
  });

  return `${bucketName}/${fileName}`;
};

/**
 * Delete a file from MinIO
 * @param fileName - The name of the file to delete
 */
export const deleteFile = async (fileName: string): Promise<void> => {
  await minioClient.removeObject(bucketName, fileName);
};
