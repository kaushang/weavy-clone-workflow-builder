import { NodeType } from './index';

export interface NodeConfig {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: 'input' | 'processing' | 'output';
}

export const NODE_CONFIGS: Record<NodeType, NodeConfig> = {
  textNode: {
    type: 'textNode',
    label: 'Text Node',
    description: 'Simple text input with textarea',
    icon: 'FileText',
    color: '#3B82F6', // blue
    category: 'input',
  },
  uploadImage: {
    type: 'uploadImage',
    label: 'Upload Image',
    description: 'Upload image via Transloadit',
    icon: 'Image',
    color: '#10B981', // green
    category: 'input',
  },
  uploadVideo: {
    type: 'uploadVideo',
    label: 'Upload Video',
    description: 'Upload video via Transloadit',
    icon: 'Video',
    color: '#8B5CF6', // purple
    category: 'input',
  },
  llmNode: {
    type: 'llmNode',
    label: 'Run LLM',
    description: 'Execute via Google Gemini API',
    icon: 'Sparkles',
    color: '#F59E0B', // amber
    category: 'processing',
  },
  cropImage: {
    type: 'cropImage',
    label: 'Crop Image',
    description: 'Crop image using FFmpeg',
    icon: 'Crop',
    color: '#EC4899', // pink
    category: 'processing',
  },
  extractFrame: {
    type: 'extractFrame',
    label: 'Extract Frame',
    description: 'Extract frame from video using FFmpeg',
    icon: 'Film',
    color: '#6366F1', // indigo
    category: 'processing',
  },
};