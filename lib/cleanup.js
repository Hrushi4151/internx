import { unlink } from 'fs/promises';
import path from 'path';
import { getUploadPath } from './fs';

export async function deleteUploadedFile(publicPath) {
  try {
    if (!publicPath) return;

    // Extract filename and folder from public path
    const [folder, filename] = publicPath.split('/').filter(Boolean);
    const filepath = path.join(getUploadPath(folder), filename);

    await unlink(filepath);
  } catch (error) {
    console.error('File deletion error:', error);
  }
} 