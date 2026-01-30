'use client';

import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Sparkles, CheckCircle } from 'lucide-react';
import { GEMINI_MODELS } from '@/lib/constants';
import { useWorkflowStore } from '@/store/workflowStore';

function LLMNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNode(id, { selectedModel: e.target.value });
    },
    [id, updateNode]
  );

  return (
    <BaseNode
      id={id}
      data={data}
      color="#F59E0B"
      inputs={[
        { id: 'systemPrompt', type: 'text', label: 'System Prompt' },
        { id: 'userMessage', type: 'text', label: 'User Message' },
        { id: 'images', type: 'image', label: 'Images' },
      ]}
      outputs={[{ id: 'output', type: 'text', label: 'Response' }]}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <label className="text-gray-400 text-xs font-medium">AI Model:</label>
        </div>

        {/* Model Selector */}
        <select
          value={data.selectedModel || 'gemini-1.5-flash'}
          onChange={handleModelChange}
          className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-amber-500 focus:outline-none nodrag"
        >
          {GEMINI_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>

        {/* Connection Status */}
        <div className="bg-weavy-dark rounded p-2 border border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Connected Inputs:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.hasSystemPrompt ? 'bg-green-500' : 'bg-gray-600'}`} />
              <span className="text-gray-400 text-xs">System Prompt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.hasUserMessage ? 'bg-green-500' : 'bg-gray-600'}`} />
              <span className="text-gray-400 text-xs">User Message</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.hasImages ? 'bg-green-500' : 'bg-gray-600'}`} />
              <span className="text-gray-400 text-xs">Images (optional)</span>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {data.result && (
          <div className="bg-green-900/20 rounded p-3 border border-green-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-green-400 text-xs font-medium">AI Response:</p>
            </div>
            <p className="text-white text-xs leading-relaxed line-clamp-4">
              {data.result}
            </p>
            <button className="text-amber-500 text-xs mt-2 hover:underline nodrag">
              Show full response
            </button>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(LLMNode);