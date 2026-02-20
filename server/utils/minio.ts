import { Client } from 'minio';
import { Readable } from 'stream';

let _client: Client | null = null;
let _bucketName: string = '';
let _initialized = false;

function getMinioClient(): Client {
  if (!_client) {
    const config = useRuntimeConfig();
    _client = new Client({
      endPoint: config.minioEndpoint || '',
      useSSL: config.minioSSL === 'true',
      accessKey: config.minioAccessKey || '',
      secretKey: config.minioSecretKey || '',
      region: config.minioRegion || 'us-east-1',
    });
    _bucketName = config.minioBucket || '';
  }
  return _client;
}

function getBucketName(): string {
  if (!_bucketName) {
    getMinioClient();
  }
  return _bucketName;
}

async function ensureBucket(): Promise<void> {
  if (_initialized) return;
  const client = getMinioClient();
  const bucket = getBucketName();
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket, useRuntimeConfig().minioRegion || 'us-east-1');
    const policy = {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      }],
    };
    await client.setBucketPolicy(bucket, JSON.stringify(policy));
  }
  _initialized = true;
}

export const uploadFile = async (
  fileStream: Readable,
  fileName: string,
  contentType: string
): Promise<string> => {
  await ensureBucket();
  const client = getMinioClient();
  const bucket = getBucketName();
  await client.putObject(bucket, fileName, fileStream, undefined, {
    'Content-Type': contentType,
  });
  return `${bucket}/${fileName}`;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  await ensureBucket();
  const client = getMinioClient();
  const bucket = getBucketName();
  await client.removeObject(bucket, fileName);
};

export const deleteFiles = async (fileNames: string[]): Promise<void> => {
  await Promise.allSettled(fileNames.map((f) => deleteFile(f)));
};
