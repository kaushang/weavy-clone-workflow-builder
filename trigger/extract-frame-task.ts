import { task } from "@trigger.dev/sdk/v3";

export interface ExtractFramePayload {
  videoUrl: string;
  timestamp: string; // "50%" or "5s"
}

export interface ExtractFrameResult {
  frameImageUrl: string;
}

export const extractFrameTask = task({
  id: "extract-frame",
  run: async (payload: ExtractFramePayload): Promise<ExtractFrameResult> => {
    console.log("🎬 Extracting frame from video at:", payload.timestamp);

    // TODO: Implement actual FFmpeg extraction via Trigger.dev
    // For now, return a placeholder
    // This will be implemented in Step 19 with FFmpeg

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("✅ Extract frame task completed");

    return {
      frameImageUrl: "https://via.placeholder.com/640x360", // Placeholder
    };
  },
});