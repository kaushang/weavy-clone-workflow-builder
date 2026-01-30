export * from './cn';

// Helper to generate unique node IDs
export function generateNodeId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to validate connection types
export function canConnect(sourceType: string, targetType: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    text: ['text'],
    image: ['image'],
    video: ['video'],
    url: ['image', 'url'], // URLs can connect to image inputs
  };
  
  return compatibilityMap[sourceType]?.includes(targetType) ?? false;
}

// Helper to format duration
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}