export const SAMPLE_WORKFLOW = {
  name: 'AI Content Generator',
  nodes: [
    {
      id: 'text-1',
      type: 'textNode',
      position: { x: 100, y: 100 },
      data: {
        label: 'Topic Input',
        type: 'textNode',
        text: 'Artificial Intelligence and the Future of Work',
      },
    },
    {
      id: 'text-2',
      type: 'textNode',
      position: { x: 100, y: 250 },
      data: {
        label: 'Style Guide',
        type: 'textNode',
        text: 'Write in a professional, informative tone suitable for a business blog.',
      },
    },
    {
      id: 'llm-1',
      type: 'llmNode',
      position: { x: 450, y: 150 },
      data: {
        label: 'Content Generator',
        type: 'llmNode',
        selectedModel: 'gemini-1.5-flash',
        temperature: 0.7,
        maxTokens: 1000,
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'text-1',
      target: 'llm-1',
      sourceHandle: 'text',
      targetHandle: 'userMessage',
      type: 'default',
      animated: true,
      style: { stroke: '#8B5CF6', strokeWidth: 2 },
    },
    {
      id: 'e2',
      source: 'text-2',
      target: 'llm-1',
      sourceHandle: 'text',
      targetHandle: 'systemPrompt',
      type: 'default',
      animated: true,
      style: { stroke: '#8B5CF6', strokeWidth: 2 },
    },
  ],
};