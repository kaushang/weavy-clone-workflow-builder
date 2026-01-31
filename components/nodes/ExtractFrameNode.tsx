'use client';

import { memo, useCallback, useState } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import NodeConfigPanel from './NodeConfigPanel';
import { Film } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function ExtractFrameNode({ id, data }: NodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleTimestampChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNode(id, { timestamp: e.target.value });
    },
    [id, updateNode]
  );

  const isValidTimestamp = (ts: string) => {
    return /^\d+%$/.test(ts) || /^\d+\.?\d*s$/.test(ts);
  };

  const isValid = isValidTimestamp(data.timestamp || '50%');

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        color="#6366F1"
        inputs={[{ id: 'video', type: 'video', label: 'Video Input', required: true }]}
        outputs={[{ id: 'output', type: 'url', label: 'Frame URL' }]}
        onOpenConfig={() => setIsConfigOpen(true)}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-500" />
            <label className="text-gray-400 text-xs font-medium">Extract At:</label>
          </div>

          {/* Compact display */}
          <div className={`bg-weavy-dark rounded p-2 border ${isValid ? 'border-gray-600' : 'border-red-500'}`}>
            <p className="text-white text-sm font-mono">{data.timestamp || '50%'}</p>
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

      {/* Configuration Panel */}
      <NodeConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title="Extract Frame Configuration"
      >
        <div className="space-y-4">
          {/* Timestamp Input */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Timestamp:
            </label>
            <input
              type="text"
              value={data.timestamp || '50%'}
              onChange={handleTimestampChange}
              placeholder="50% or 5s"
              className={`w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border ${
                isValid ? 'border-gray-600 focus:border-indigo-500' : 'border-red-500'
              } focus:outline-none`}
            />
            {!isValid && (
              <p className="text-red-500 text-xs mt-1">
                Invalid format. Use "50%" or "5s"
              </p>
            )}
          </div>

          {/* Format Guide */}
          <div className="bg-weavy-dark rounded p-3 border border-gray-600">
            <p className="text-gray-400 text-xs font-medium mb-2">Format Guide:</p>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>• <span className="text-indigo-400 font-mono">50%</span> - Extract at 50% of video duration</li>
              <li>• <span className="text-indigo-400 font-mono">5s</span> - Extract at 5 seconds</li>
              <li>• <span className="text-indigo-400 font-mono">0%</span> - First frame</li>
              <li>• <span className="text-indigo-400 font-mono">100%</span> - Last frame</li>
            </ul>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Quick Presets:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['0%', '25%', '50%', '75%', '100%', '1s', '5s', '10s'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => updateNode(id, { timestamp: preset })}
                  className="px-2 py-1.5 bg-weavy-dark hover:bg-gray-700 text-white text-xs rounded border border-gray-600 transition-colors font-mono"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
            <p className="text-blue-400 text-xs font-medium mb-1">Tips:</p>
            <ul className="text-gray-300 text-[11px] space-y-1">
              <li>• Use percentages for relative positioning</li>
              <li>• Use seconds for exact timestamps</li>
              <li>• Extract at 50% for a middle frame</li>
            </ul>
          </div>
        </div>
      </NodeConfigPanel>
    </>
  );
}

export default memo(ExtractFrameNode);