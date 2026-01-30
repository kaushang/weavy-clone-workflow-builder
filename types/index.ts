// Node Types
export type NodeType =
  | 'textNode'
  | 'uploadImage'
  | 'uploadVideo'
  | 'llmNode'
  | 'cropImage'
  | 'extractFrame';

// Handle Types
export type HandleType = 'text' | 'image' | 'video' | 'url';

// Base Node Data
export interface BaseNodeData {
  label: string;
  type: NodeType;
}

// Text Node Data
export interface TextNodeData extends BaseNodeData {
  type: 'textNode';
  text: string;
  outputHandle: 'text';
}

// Upload Image Node Data
export interface UploadImageNodeData extends BaseNodeData {
  type: 'uploadImage';
  imageUrl?: string;
  imageFile?: File;
  outputHandle: 'image';
}

// Upload Video Node Data
export interface UploadVideoNodeData extends BaseNodeData {
  type: 'uploadVideo';
  videoUrl?: string;
  videoFile?: File;
  outputHandle: 'video';
}

// LLM Node Data
export interface LLMNodeData extends BaseNodeData {
  type: 'llmNode';
  systemPrompt?: string;
  userMessage?: string;
  selectedModel?: string;
  inputHandles: {
    systemPrompt?: 'text';
    userMessage?: 'text';
    images?: 'image';
  };
  outputHandle: 'text';
  result?: string;
}

// Crop Image Node Data
export interface CropImageNodeData extends BaseNodeData {
  type: 'cropImage';
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  inputHandle: 'image';
  outputHandle: 'url';
  croppedUrl?: string;
}

// Extract Frame Node Data
export interface ExtractFrameNodeData extends BaseNodeData {
  type: 'extractFrame';
  timestamp: string; // "50%" or "5s"
  inputHandle: 'video';
  outputHandle: 'url';
  frameUrl?: string;
}

// Union type for all node data
export type NodeData =
  | TextNodeData
  | UploadImageNodeData
  | UploadVideoNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

// Workflow Run Status
export type RunStatus = 'pending' | 'running' | 'success' | 'failed' | 'partial';

// Workflow Run Type
export interface WorkflowRun {
  id: string;
  workflowId: string;
  timestamp: Date;
  status: RunStatus;
  duration?: number;
  scope: 'full' | 'partial' | 'single';
  nodeResults: {
    nodeId: string;
    status: RunStatus;
    duration: number;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    error?: string;
  }[];
}

// Workflow Definition
export interface Workflow {
  id: string;
  name: string;
  userId: string;
  nodes: any[]; // React Flow nodes
  edges: any[]; // React Flow edges
  createdAt: Date;
  updatedAt: Date;
}