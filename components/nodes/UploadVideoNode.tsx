'use client';

import { memo, useCallback, useRef } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Video, Upload, X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function UploadVideoNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      updateNode(id, {
        videoUrl: url,
        videoFile: file,
        fileName: file.name,
        fileSize: file.size,
      });
    },
    [id, updateNode]
  );

  const handleRemove = useCallback(() => {
    if (data.videoUrl) {
      URL.revokeObjectURL(data.videoUrl);
    }
    updateNode(id, {
      videoUrl: null,
      videoFile: null,
      fileName: null,
      fileSize: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [id, data.videoUrl, updateNode]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseNode
      id={id}
      data={data}
      color="#8B5CF6"
      outputs={[{ id: 'video', type: 'video', label: 'Video' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-4 h-4 text-purple-500" />
          <label className="text-gray-400 text-xs font-medium">Upload Video:</label>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {data.videoUrl ? (
          <div className="space-y-2">
            <div className="relative group">
              <video
                src={data.videoUrl}
                controls
                className="w-full h-32 rounded border border-gray-600 bg-black nodrag"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity nodrag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <p className="truncate">📹 {data.fileName}</p>
              <p>📏 {(data.fileSize / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
            
            <button
              onClick={handleClick}
              className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors nodrag"
            >
              Change Video
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer nodrag"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">Click to upload</p>
            <p className="text-gray-500 text-xs mt-1">MP4, MOV, WEBM, M4V</p>
            <p className="text-gray-600 text-xs mt-1">Max 50MB</p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(UploadVideoNode);