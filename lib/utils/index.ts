export * from './cn';

// Helper to generate unique node IDs
export function generateNodeId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Enhanced connection validation
export function canConnect(sourceType: string, targetType: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    text: ['text'],           // Text can only connect to text inputs
    image: ['image'],         // Image can only connect to image inputs
    video: ['video'],         // Video can only connect to video inputs
    url: ['image', 'url'],    // URL can connect to image or url inputs
  };
  
  return compatibilityMap[sourceType]?.includes(targetType) ?? false;
}

// Helper to format duration
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

// Get handle type from node data
export function getHandleType(nodeType: string, handleId: string): string {
  const handleTypeMap: Record<string, Record<string, string>> = {
    textNode: {
      text: 'text',
    },
    uploadImage: {
      image: 'image',
    },
    uploadVideo: {
      video: 'video',
    },
    llmNode: {
      systemPrompt: 'text',
      userMessage: 'text',
      images: 'image',
      output: 'text',
    },
    cropImage: {
      image: 'image',
      output: 'url',
    },
    extractFrame: {
      video: 'video',
      output: 'url',
    },
  };

  return handleTypeMap[nodeType]?.[handleId] || 'text';
}

// Validate if a connection would create a cycle
export function wouldCreateCycle(
  sourceId: string,
  targetId: string,
  edges: any[]
): boolean {
  const visited = new Set<string>();
  
  function hasPath(from: string, to: string): boolean {
    if (from === to) return true;
    if (visited.has(from)) return false;
    
    visited.add(from);
    
    const outgoingEdges = edges.filter(edge => edge.source === from);
    for (const edge of outgoingEdges) {
      if (hasPath(edge.target, to)) return true;
    }
    
    return false;
  }
  
  return hasPath(targetId, sourceId);
}