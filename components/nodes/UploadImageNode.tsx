'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Image, Upload } from 'lucide-react';

function UploadImageNode({ id, data }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data}
      color="#10B981"
      outputs={[{ id: 'image', type: 'image', label: 'Image' }]}
    >
      <div>
        <label className="text-gray-400 text-xs mb-2 block">Upload Image:</label>
        
        {data.imageUrl ? (
          <div className="space-y-2">
            <img
              src={data.imageUrl}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded border border-gray-600"
            />
            <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
              Remove Image
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-weavy-purple transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">Click to upload</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP, GIF</p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(UploadImageNode);