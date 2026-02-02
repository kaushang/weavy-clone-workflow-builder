export interface ExtractFrameParams {
  videoUrl: string;
  timestamp: string; // "50%" or "5s"
}

export interface ExtractFrameResult {
  frameUrl: string;
  width: number;
  height: number;
}

export async function extractFrame(params: ExtractFrameParams): Promise<ExtractFrameResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      try {
        const duration = video.duration;
        let seekTime = 0;

        // Parse timestamp
        if (params.timestamp.endsWith('%')) {
          const percent = parseFloat(params.timestamp);
          seekTime = (percent / 100) * duration;
        } else if (params.timestamp.endsWith('s')) {
          seekTime = parseFloat(params.timestamp);
        } else {
          seekTime = duration / 2; // Default to middle
        }

        // Clamp to valid range
        seekTime = Math.max(0, Math.min(seekTime, duration));

        video.currentTime = seekTime;
      } catch (error) {
        reject(error);
      }
    };

    video.onseeked = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const frameUrl = canvas.toDataURL('image/jpeg', 0.9);

        resolve({
          frameUrl,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = params.videoUrl;
  });
}