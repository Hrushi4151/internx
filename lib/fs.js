import { mkdir, access } from 'fs/promises';
import path from 'path';

export async function ensureDirectory(dirPath) {
  try {
    await access(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

export function getUploadPath(folder = 'uploads') {
  return path.join(process.cwd(), 'public', folder);
}

export function getPublicPath(filename, folder = 'uploads') {
  return `/${folder}/${filename}`;
} 