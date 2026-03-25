import { adminSupabase } from './supabase';
import { compressImage } from './imageCompression';

/**
 * Uploads a file to a specified Supabase bucket and returns its public URL.
 * @param file The file to upload.
 * @param bucket The name of the bucket (e.g., 'products', 'categories').
 * @param path The sub-path inside the bucket (optional).
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(file: File, bucket: string, path?: string): Promise<string> {
  let fileToUpload = file;
  
  // Conditionally compress if we are in browser and it's an image
  if (typeof window !== 'undefined' && file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file, 1200, 0.85);
    } catch(e) {
      console.warn("Image compression failed, uploading original:", e);
    }
  }

  const fileExt = fileToUpload.name.split('.').pop() || 'webp';
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await adminSupabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = adminSupabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
