export interface UploadResult {
  url: string;
  fileType: 'image' | 'video';
  fileName: string;
  fileSize: number;
}

// For now, we'll use a simple file-to-base64 approach
// In production, you'd use Transloadit's API
export async function uploadFile(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      
      resolve({
        url: base64,
        fileType: file.type.startsWith('image/') ? 'image' : 'video',
        fileName: file.name,
        fileSize: file.size,
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}