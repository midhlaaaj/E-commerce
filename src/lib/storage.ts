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

  // Add a 30s timeout to prevent hanging in background tabs
  const uploadPromise = adminSupabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false
    });

  const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
    setTimeout(() => reject(new Error('Upload timed out after 30 seconds. Please keep the tab active.')), 30000)
  );

  const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as { data: any, error: any };

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = adminSupabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
