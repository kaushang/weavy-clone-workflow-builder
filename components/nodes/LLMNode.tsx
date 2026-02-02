'use client';

import { memo, useMemo, useState } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import NodeConfigPanel from './NodeConfigPanel';
import { Sparkles, CheckCircle, Circle } from 'lucide-react';
import { GEMINI_MODELS } from '@/lib/constants';
import { useWorkflowStore } from '@/store/workflowStore';

function LLMNode({ id, data }: NodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const getConnectedInputs = useWorkflowStore((state) => state.getConnectedInputs);

  const connectedInputs = useMemo(() => {
    return getConnectedInputs(id);
  }, [id, getConnectedInputs]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNode(id, { selectedModel: e.target.value });
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(id, { systemPromptOverride: e.target.value });
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(id, { maxTokens: Number(e.target.value) });
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(id, { temperature: Number(e.target.value) });
  };

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        color="#F59E0B"
        inputs={[
          { id: 'systemPrompt', type: 'text', label: 'System Prompt', required: false },
          { id: 'userMessage', type: 'text', label: 'User Message', required: true },
          { id: 'images', type: 'image', label: 'Images', required: false },
        ]}
        outputs={[{ id: 'output', type: 'text', label: 'AI Response' }]}
        onOpenConfig={() => setIsConfigOpen(true)}
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
                  System Prompt {connectedInputs.systemPrompt && '✓'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {connectedInputs.userMessage ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-600" />
                )}
                <span className={`text-xs ${connectedInputs.userMessage ? 'text-green-400' : 'text-gray-500'}`}>
                  User Message {connectedInputs.userMessage && '✓'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {connectedInputs.images ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-600" />
                )}
                <span className={`text-xs ${connectedInputs.images ? 'text-green-400' : 'text-gray-500'}`}>
                  Images (optional) {connectedInputs.images && '✓'}
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

      {/* Configuration Panel */}
      <NodeConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title="LLM Configuration"
      >
        <div className="space-y-4">
          {/* Model Selection */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Model:
            </label>
            <select
              value={data.selectedModel || 'gemini-1.5-flash'}
              onChange={handleModelChange}
              className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
            >
              {GEMINI_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Temperature: {data.temperature || 0.7}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={data.temperature || 0.7}
              onChange={handleTemperatureChange}
              className="w-full accent-weavy-purple nodrag nopan"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Precise (0)</span>
              <span>Balanced (1)</span>
              <span>Creative (2)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Max Tokens:
            </label>
            <input
              type="number"
              value={data.maxTokens || 1000}
              onChange={handleMaxTokensChange}
              min="100"
              max="8000"
              step="100"
              className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none nodrag"
            />
            <p className="text-gray-500 text-[10px] mt-1">
              Maximum length of the response (100-8000)
            </p>
          </div>

          {/* System Prompt Override */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              System Prompt Override:
            </label>
            <textarea
              value={data.systemPromptOverride || ''}
              onChange={handleSystemPromptChange}
              placeholder="Optional: Override the system prompt..."
              className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none resize-none nodrag"
              rows={4}
            />
            <p className="text-gray-500 text-[10px] mt-1">
              Used when no system prompt is connected
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
            <p className="text-blue-400 text-xs font-medium mb-1">Configuration Tips:</p>
            <ul className="text-gray-300 text-[11px] space-y-1">
              <li>• Lower temperature for factual responses</li>
              <li>• Higher temperature for creative content</li>
              <li>• Adjust max tokens based on expected output length</li>
            </ul>
          </div>
        </div>
      </NodeConfigPanel>
    </>
  );
}

export default memo(LLMNode);