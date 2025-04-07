import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    
    return {
      filename: file.name,
      contentType: file.type,
      data: base64String
    };
  } catch (error) {
    console.error('File conversion error:', error);
    throw new Error('Failed to process file');
  }
}

export function getFileUrl(fileData) {
  if (!fileData) return null;
  return `data:${fileData.contentType};base64,${fileData.data}`;
} 