'use client';

import { memo, ReactNode } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '@/lib/utils';

interface BaseNodeProps {
  id: string;
  data: any;
  children: ReactNode;
  color: string;
  inputs?: { id: string; type: string; label: string }[];
  outputs?: { id: string; type: string; label: string }[];
}

function BaseNode({ id, data, children, color, inputs = [], outputs = [] }: BaseNodeProps) {
  const runningNodes = useWorkflowStore((state) => state.runningNodes);
  const isRunning = runningNodes.has(id);

  return (
    <div
      className={cn(
        'bg-weavy-gray border-2 rounded-lg shadow-lg min-w-[280px]',
        isRunning ? 'border-weavy-purple animate-pulse-glow' : 'border-gray-600'
      )}
      style={{
        borderColor: isRunning ? '#8B5CF6' : undefined,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2 rounded-t-lg border-b border-gray-700"
        style={{ backgroundColor: color + '20' }}
      >
        <p className="text-white text-sm font-medium">{data.label}</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
            background: getHandleColor(input.type),
            width: 10,
            height: 10,
            border: '2px solid white',
          }}
          className="hover:scale-125 transition-transform"
        />
      ))}

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
            background: getHandleColor(output.type),
            width: 10,
            height: 10,
            border: '2px solid white',
          }}
          className="hover:scale-125 transition-transform"
        />
      ))}
    </div>
  );
}

function getHandleColor(type: string): string {
  const colors: Record<string, string> = {
    text: '#3B82F6',
    image: '#10B981',
    video: '#8B5CF6',
    url: '#F59E0B',
  };
  return colors[type] || '#6B7280';
}

export default memo(BaseNode);