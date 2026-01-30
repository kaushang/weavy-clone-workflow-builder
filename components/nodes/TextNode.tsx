'use client';

import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { useWorkflowStore } from '@/store/workflowStore';

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
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Text Content:</label>
        <textarea
          value={data.text || ''}
          onChange={handleTextChange}
          placeholder="Enter text here..."
          className="w-full px-3 py-2 bg-weavy-dark text-white text-sm rounded border border-gray-600 focus:border-weavy-purple focus:outline-none resize-none"
          rows={4}
        />
        {data.text && (
          <p className="text-gray-500 text-xs mt-1">
            {data.text.length} characters
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export default memo(TextNode);