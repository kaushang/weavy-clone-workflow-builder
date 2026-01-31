'use client';

import { memo, useCallback, useState } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import NodeConfigPanel from './NodeConfigPanel';
import { Crop } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function CropImageNode({ id, data }: NodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleChange = useCallback(
    (field: string, value: number) => {
      updateNode(id, { [field]: value });
    },
    [id, updateNode]
  );

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        color="#EC4899"
        inputs={[{ id: 'image', type: 'image', label: 'Image Input', required: true }]}
        outputs={[{ id: 'output', type: 'url', label: 'Cropped URL' }]}
        onOpenConfig={() => setIsConfigOpen(true)}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-pink-500" />
            <label className="text-gray-400 text-xs font-medium">Crop Area:</label>
          </div>

          {/* Compact display */}
          <div className="bg-weavy-dark rounded p-2 border border-gray-600">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div>
                <span className="text-gray-500">X:</span> {data.xPercent || 0}%
              </div>
              <div>
                <span className="text-gray-500">Y:</span> {data.yPercent || 0}%
              </div>
              <div>
                <span className="text-gray-500">W:</span> {data.widthPercent || 100}%
              </div>
              <div>
                <span className="text-gray-500">H:</span> {data.heightPercent || 100}%
              </div>
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

      {/* Configuration Panel */}
      <NodeConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title="Crop Image Configuration"
      >
        <div className="space-y-4">
          {/* Visual crop preview */}
          <div className="bg-weavy-dark rounded p-4 border border-gray-600">
            <div className="relative w-full h-48 bg-gray-800 rounded">
              <div
                className="absolute bg-pink-500/30 border-2 border-pink-500 rounded"
                style={{
                  left: `${data.xPercent || 0}%`,
                  top: `${data.yPercent || 0}%`,
                  width: `${data.widthPercent || 100}%`,
                  height: `${data.heightPercent || 100}%`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crop className="w-6 h-6 text-pink-500" />
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-[10px] mt-2 text-center">
              Crop area visualization
            </p>
          </div>

          {/* X Position */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block flex justify-between">
              <span>X Position:</span>
              <span className="text-white">{data.xPercent || 0}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.xPercent || 0}
              onChange={(e) => handleChange('xPercent', Number(e.target.value))}
              className="w-full accent-pink-500 nodrag nopan"
            />
          </div>

          {/* Y Position */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block flex justify-between">
              <span>Y Position:</span>
              <span className="text-white">{data.yPercent || 0}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.yPercent || 0}
              onChange={(e) => handleChange('yPercent', Number(e.target.value))}
              className="w-full accent-pink-500 nodrag nopan"
            />
          </div>

          {/* Width */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block flex justify-between">
              <span>Width:</span>
              <span className="text-white">{data.widthPercent || 100}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={data.widthPercent || 100}
              onChange={(e) => handleChange('widthPercent', Number(e.target.value))}
              className="w-full accent-pink-500 nodrag nopan"
            />
          </div>

          {/* Height */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block flex justify-between">
              <span>Height:</span>
              <span className="text-white">{data.heightPercent || 100}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={data.heightPercent || 100}
              onChange={(e) => handleChange('heightPercent', Number(e.target.value))}
              className="w-full accent-pink-500 nodrag nopan"
            />
          </div>

          {/* Presets */}
          <div>
            <label className="text-gray-400 text-xs font-medium mb-2 block">
              Quick Presets:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleChange('xPercent', 25);
                  handleChange('yPercent', 25);
                  handleChange('widthPercent', 50);
                  handleChange('heightPercent', 50);
                }}
                className="px-3 py-2 bg-weavy-dark hover:bg-gray-700 text-white text-xs rounded border border-gray-600 transition-colors"
              >
                Center 50%
              </button>
              <button
                onClick={() => {
                  handleChange('xPercent', 20);
                  handleChange('yPercent', 20);
                  handleChange('widthPercent', 60);
                  handleChange('heightPercent', 60);
                }}
                className="px-3 py-2 bg-weavy-dark hover:bg-gray-700 text-white text-xs rounded border border-gray-600 transition-colors"
              >
                Center 60%
              </button>
              <button
                onClick={() => {
                  handleChange('xPercent', 0);
                  handleChange('yPercent', 0);
                  handleChange('widthPercent', 100);
                  handleChange('heightPercent', 100);
                }}
                className="px-3 py-2 bg-weavy-dark hover:bg-gray-700 text-white text-xs rounded border border-gray-600 transition-colors"
              >
                Full Image
              </button>
              <button
                onClick={() => {
                  handleChange('xPercent', 0);
                  handleChange('yPercent', 25);
                  handleChange('widthPercent', 100);
                  handleChange('heightPercent', 50);
                }}
                className="px-3 py-2 bg-weavy-dark hover:bg-gray-700 text-white text-xs rounded border border-gray-600 transition-colors"
              >
                Center Strip
              </button>
            </div>
          </div>
        </div>
      </NodeConfigPanel>
    </>
  );
}

export default memo(CropImageNode);