'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Film } from 'lucide-react';

function ExtractFrameNode({ id, data }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data}
      color="#6366F1"
      inputs={[{ id: 'video', type: 'video', label: 'Video Input' }]}
      outputs={[{ id: 'output', type: 'url', label: 'Frame Image URL' }]}
    >
      <div className="space-y-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Timestamp:</label>
          <input
            type="text"
            value={data.timestamp || '50%'}
            placeholder="50% or 5s"
            className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            Format: "50%" or "5s"
          </p>
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