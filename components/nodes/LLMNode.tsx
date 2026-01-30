'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Sparkles } from 'lucide-react';
import { GEMINI_MODELS } from '@/lib/constants';

function LLMNode({ id, data }: NodeProps) {
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
        {/* Model Selector */}
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Model:</label>
          <select
            value={data.selectedModel || 'gemini-1.5-flash'}
            className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
          >
            {GEMINI_MODELS.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result Display */}
        {data.result && (
          <div className="bg-weavy-dark rounded p-3 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-gray-400 text-xs font-medium">Response:</p>
            </div>
            <p className="text-white text-xs leading-relaxed">
              {data.result}
            </p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(LLMNode);