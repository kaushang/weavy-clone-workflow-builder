'use client';

import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Film } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function ExtractFrameNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleTimestampChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNode(id, { timestamp: e.target.value });
    },
    [id, updateNode]
  );

  // Validate timestamp format
  const isValidTimestamp = (ts: string) => {
    return /^\d+%$/.test(ts) || /^\d+\.?\d*s$/.test(ts);
  };

  const isValid = isValidTimestamp(data.timestamp || '50%');

  return (
    <BaseNode
      id={id}
      data={data}
      color="#6366F1"
      inputs={[{ id: 'video', type: 'video', label: 'Video Input', required: true }]}
      outputs={[{ id: 'output', type: 'url', label: 'Frame Image URL' }]}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-500" />
          <label className="text-gray-400 text-xs font-medium">Extract Frame At:</label>
        </div>

        <div>
          <input
            type="text"
            value={data.timestamp || '50%'}
            onChange={handleTimestampChange}
            placeholder="50% or 5s"
            className={`w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border ${
              isValid ? 'border-gray-600 focus:border-indigo-500' : 'border-red-500'
            } focus:outline-none nodrag`}
          />
          <p className="text-gray-500 text-xs mt-1">
            Format: "50%" (percentage) or "5s" (seconds)
          </p>
          {!isValid && (
            <p className="text-red-500 text-xs mt-1">
              Invalid format
            </p>
          )}
        </div>

        {/* Examples */}
        <div className="bg-weavy-dark rounded p-2 border border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Examples:</p>
          <div className="flex gap-2 flex-wrap">
            {['0%', '25%', '50%', '75%', '100%', '5s', '10s'].map((example) => (
              <button
                key={example}
                onClick={() => updateNode(id, { timestamp: example })}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded nodrag"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {data.frameUrl && (
          <div>
            <p className="text-gray-400 text-xs mb-1">Extracted Frame:</p>
            <img
              src={data.frameUrl}
              alt="Frame"
              className="w-full h-24 object-cover rounded border border-gray-600"
            />
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(ExtractFrameNode);