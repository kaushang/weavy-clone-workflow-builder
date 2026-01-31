import { NodeType } from '@/types';

export interface HandleConfig {
  id: string;
  type: 'text' | 'image' | 'video' | 'url';
  label: string;
  required?: boolean;
  position: 'left' | 'right';
}

export interface NodeHandleConfig {
  inputs: HandleConfig[];
  outputs: HandleConfig[];
}

export const NODE_HANDLE_CONFIGS: Record<NodeType, NodeHandleConfig> = {
  textNode: {
    inputs: [],
    outputs: [
      { id: 'text', type: 'text', label: 'Text Output', position: 'right' }
    ],
  },
  uploadImage: {
    inputs: [],
    outputs: [
      { id: 'image', type: 'image', label: 'Image', position: 'right' }
    ],
  },
  uploadVideo: {
    inputs: [],
    outputs: [
      { id: 'video', type: 'video', label: 'Video', position: 'right' }
    ],
  },
  llmNode: {
    inputs: [
      { id: 'systemPrompt', type: 'text', label: 'System Prompt', position: 'left' },
      { id: 'userMessage', type: 'text', label: 'User Message', required: true, position: 'left' },
      { id: 'images', type: 'image', label: 'Images', position: 'left' },
    ],
    outputs: [
      { id: 'output', type: 'text', label: 'AI Response', position: 'right' }
    ],
  },
  cropImage: {
    inputs: [
      { id: 'image', type: 'image', label: 'Image Input', required: true, position: 'left' }
    ],
    outputs: [
      { id: 'output', type: 'url', label: 'Cropped URL', position: 'right' }
    ],
  },
  extractFrame: {
    inputs: [
      { id: 'video', type: 'video', label: 'Video Input', required: true, position: 'left' }
    ],
    outputs: [
      { id: 'output', type: 'url', label: 'Frame URL', position: 'right' }
    ],
  },
};

// Get handle configuration for a specific node type
export function getNodeHandles(nodeType: NodeType): NodeHandleConfig {
  return NODE_HANDLE_CONFIGS[nodeType] || { inputs: [], outputs: [] };
}

// Check if handle is required
export function isHandleRequired(nodeType: NodeType, handleId: string): boolean {
  const config = NODE_HANDLE_CONFIGS[nodeType];
  const handle = [...config.inputs, ...config.outputs].find(h => h.id === handleId);
  return handle?.required || false;
}

// Get handle color based on type
export function getHandleColor(type: string): string {
  const colors: Record<string, string> = {
    text: '#3B82F6',    // blue
    image: '#10B981',   // green
    video: '#8B5CF6',   // purple
    url: '#F59E0B',     // amber
  };
  return colors[type] || '#6B7280';
}

// Get handle label
export function getHandleLabel(nodeType: NodeType, handleId: string): string {
  const config = NODE_HANDLE_CONFIGS[nodeType];
  const handle = [...config.inputs, ...config.outputs].find(h => h.id === handleId);
  return handle?.label || handleId;
}