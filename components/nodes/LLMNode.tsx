'use client';

import { memo, useMemo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Sparkles, CheckCircle, Circle } from 'lucide-react';
import { GEMINI_MODELS } from '@/lib/constants';
import { useWorkflowStore } from '@/store/workflowStore';

function LLMNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const getConnectedInputs = useWorkflowStore((state) => state.getConnectedInputs);

  // Get connected inputs
  const connectedInputs = useMemo(() => {
    return getConnectedInputs(id);
  }, [id, getConnectedInputs]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNode(id, { selectedModel: e.target.value });
  };

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
          <p className="text-gray-400 text-xs mb-2 font-medium">Input Status:</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {connectedInputs.systemPrompt ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Circle className="w-3 h-3 text-gray-600" />
              )}
              <span className={`text-xs ${connectedInputs.systemPrompt ? 'text-green-400' : 'text-gray-500'}`}>
                System Prompt {connectedInputs.systemPrompt && '(connected)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {connectedInputs.userMessage ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Circle className="w-3 h-3 text-gray-600" />
              )}
              <span className={`text-xs ${connectedInputs.userMessage ? 'text-green-400' : 'text-gray-500'}`}>
                User Message {connectedInputs.userMessage && '(connected)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {connectedInputs.images ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Circle className="w-3 h-3 text-gray-600" />
              )}
              <span className={`text-xs ${connectedInputs.images ? 'text-green-400' : 'text-gray-500'}`}>
                Images {connectedInputs.images && '(optional, connected)'}
              </span>
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
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(LLMNode);