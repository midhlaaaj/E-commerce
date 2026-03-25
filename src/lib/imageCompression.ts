/**
 * Compresses an image file using HTML5 Canvas API
 * @param file Original image file
 * @param maxWidth Maximum width in pixels
 * @param quality Compression quality (0 to 1)
 * @returns Compressed File object in WebP format
 */
export async function compressImage(file: File, maxWidth: number = 1080, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // fallback to original
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP for maximum compression
        canvas.toBlob((blob) => {
          if (!blob) {
            return resolve(file); // fallback
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/webp', quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
