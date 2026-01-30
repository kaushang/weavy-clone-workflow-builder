'use client';

import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { useWorkflowStore } from '@/store/workflowStore';
import { FileText } from 'lucide-react';

function TextNode({ id, data }: NodeProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNode(id, { text: e.target.value });
    },
    [id, updateNode]
  );

  return (
    <BaseNode
      id={id}
      data={data}
      color="#3B82F6"
      outputs={[{ id: 'text', type: 'text', label: 'Text Output' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <label className="text-gray-400 text-xs font-medium">Text Content:</label>
        </div>
        
        <textarea
          value={data.text || ''}
          onChange={handleTextChange}
          placeholder="Enter text here..."
          className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none nodrag"
          rows={4}
        />
        
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-xs">
            {data.text?.length || 0} characters
          </p>
          {data.text && data.text.length > 500 && (
            <p className="text-amber-500 text-xs">Long text</p>
          )}
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(TextNode);