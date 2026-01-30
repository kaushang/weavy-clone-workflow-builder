'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Video, Upload } from 'lucide-react';

function UploadVideoNode({ id, data }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data}
      color="#8B5CF6"
      outputs={[{ id: 'video', type: 'video', label: 'Video' }]}
    >
      <div>
        <label className="text-gray-400 text-xs mb-2 block">Upload Video:</label>
        
        {data.videoUrl ? (
          <div className="space-y-2">
            <video
              src={data.videoUrl}
              controls
              className="w-full h-32 rounded border border-gray-600 bg-black"
            />
            <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
              Remove Video
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-weavy-purple transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">Click to upload</p>
            <p className="text-gray-500 text-xs mt-1">MP4, MOV, WEBM, M4V</p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(UploadVideoNode);