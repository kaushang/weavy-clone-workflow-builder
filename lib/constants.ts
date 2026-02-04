// Gemini models available (confirmed working with @google/generative-ai 0.24.1)
export const GEMINI_MODELS = [
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
  { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
];

// Default node positions
export const DEFAULT_NODE_POSITION = { x: 250, y: 100 };

// Node dimensions
export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 'auto';

// Handle types and their colors
export const HANDLE_COLORS = {
  text: '#3B82F6',    // blue
  image: '#10B981',   // green
  video: '#8B5CF6',   // purple
  url: '#F59E0B',     // amber
};

// Status colors for history
export const STATUS_COLORS = {
  pending: '#6B7280',   // gray
  running: '#F59E0B',   // amber
  success: '#10B981',   // green
  failed: '#EF4444',    // red
  partial: '#F59E0B',   // amber
};