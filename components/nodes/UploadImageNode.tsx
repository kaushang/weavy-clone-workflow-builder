'use client';

import { memo, useCallback, useRef } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { Image, Upload, X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

function UploadImageNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        updateNode(id, {
          imageUrl: e.target?.result as string,
          imageFile: file,
          fileName: file.name,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNode]
  );

  const handleRemove = useCallback(() => {
    updateNode(id, {
      imageUrl: null,
      imageFile: null,
      fileName: null,
      fileSize: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [id, updateNode]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseNode
      id={id}
      data={data}
      color="#10B981"
      outputs={[{ id: 'image', type: 'image', label: 'Image' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-4 h-4 text-green-500" />
          <label className="text-gray-400 text-xs font-medium">Upload Image:</label>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {data.imageUrl ? (
          <div className="space-y-2">
            <div className="relative group">
              <img
                src={data.imageUrl}
                alt="Uploaded"
                className="w-full h-32 object-cover rounded border border-gray-600"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <p className="truncate">📄 {data.fileName}</p>
              <p>📏 {(data.fileSize / 1024).toFixed(1)} KB</p>
            </div>
            
            <button
              onClick={handleClick}
              className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors nodrag"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer nodrag"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">Click to upload</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP, GIF</p>
            <p className="text-gray-600 text-xs mt-1">Max 10MB</p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(UploadImageNode);