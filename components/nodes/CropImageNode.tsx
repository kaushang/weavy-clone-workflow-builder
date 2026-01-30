'use client';

import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Crop } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function CropImageNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleChange = useCallback(
    (field: string, value: number) => {
      updateNode(id, { [field]: value });
    },
    [id, updateNode]
  );

  return (
    <BaseNode
      id={id}
      data={data}
      color="#EC4899"
      inputs={[{ id: 'image', type: 'image', label: 'Image Input' }]}
      outputs={[{ id: 'output', type: 'url', label: 'Cropped Image URL' }]}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-pink-500" />
          <label className="text-gray-400 text-xs font-medium">Crop Parameters:</label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">X Position %:</label>
            <input
              type="number"
              value={data.xPercent || 0}
              onChange={(e) => handleChange('xPercent', Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-pink-500 focus:outline-none nodrag"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Y Position %:</label>
            <input
              type="number"
              value={data.yPercent || 0}
              onChange={(e) => handleChange('yPercent', Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-pink-500 focus:outline-none nodrag"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Width %:</label>
            <input
              type="number"
              value={data.widthPercent || 100}
              onChange={(e) => handleChange('widthPercent', Number(e.target.value))}
              min="1"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-pink-500 focus:outline-none nodrag"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Height %:</label>
            <input
              type="number"
              value={data.heightPercent || 100}
              onChange={(e) => handleChange('heightPercent', Number(e.target.value))}
              min="1"
              max="100"
              className="w-full px-2 py-1 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-pink-500 focus:outline-none nodrag"
            />
          </div>
        </div>

        {/* Preview info */}
        <div className="bg-weavy-dark rounded p-2 border border-gray-600">
          <p className="text-gray-400 text-xs">
            Crop from ({data.xPercent || 0}%, {data.yPercent || 0}%) with size {data.widthPercent || 100}% × {data.heightPercent || 100}%
          </p>
        </div>

        {data.croppedUrl && (
          <div>
            <p className="text-gray-400 text-xs mb-1">Cropped Result:</p>
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