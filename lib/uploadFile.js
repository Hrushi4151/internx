import { writeFile } from 'fs/promises';
import path from 'path';
import { ensureDirectory, getUploadPath, getPublicPath } from './fs';

export async function uploadFile(file, folder = 'uploads') {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${timestamp}-${originalName}`;

    // Ensure upload directory exists
    const uploadDir = getUploadPath(folder);
    await ensureDirectory(uploadDir);

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL
    return getPublicPath(filename, folder);
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
} 