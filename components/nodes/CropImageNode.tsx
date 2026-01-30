'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Crop } from 'lucide-react';

function CropImageNode({ id, data }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data}
      color="#EC4899"
      inputs={[{ id: 'image', type: 'image', label: 'Image Input' }]}
      outputs={[{ id: 'output', type: 'url', label: 'Cropped Image URL' }]}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">X %:</label>
            <input
              type="number"
              value={data.xPercent || 0}
              min="0"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Y %:</label>
            <input
              type="number"
              value={data.yPercent || 0}
              min="0"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Width %:</label>
            <input
              type="number"
              value={data.widthPercent || 100}
              min="1"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Height %:</label>
            <input
              type="number"
              value={data.heightPercent || 100}
              min="1"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none"
            />
          </div>
        </div>

        {data.croppedUrl && (
          <div>
            <p className="text-gray-400 text-xs mb-1">Preview:</p>
            <img
              src={data.croppedUrl}
              alt="Cropped"
              className="w-full h-24 object-cover rounded border border-gray-600"
            />
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(CropImageNode);