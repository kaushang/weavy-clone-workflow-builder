export interface CropImageParams {
  imageUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface CropImageResult {
  croppedUrl: string;
  width: number;
  height: number;
}

export async function cropImage(params: CropImageParams): Promise<CropImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate crop dimensions
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        
        const cropX = (params.xPercent / 100) * sourceWidth;
        const cropY = (params.yPercent / 100) * sourceHeight;
        const cropWidth = (params.widthPercent / 100) * sourceWidth;
        const cropHeight = (params.heightPercent / 100) * sourceHeight;

        // Set canvas size to crop size
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw cropped image
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        // Convert to base64
        const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);

        resolve({
          croppedUrl,
          width: cropWidth,
          height: cropHeight,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = params.imageUrl;
  });
}