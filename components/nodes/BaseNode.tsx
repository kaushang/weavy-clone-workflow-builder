'use client';

import { memo, ReactNode, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '@/lib/utils';
import { getHandleColor } from '@/lib/nodeHandles';
import NodeValidationBadge from '../ui/NodeValidationBadge';
import { NodeType } from '@/types';

interface HandleInfo {
  id: string;
  type: string;
  label: string;
  required?: boolean;
}

interface BaseNodeProps {
  id: string;
  data: any;
  children: ReactNode;
  color: string;
  inputs?: HandleInfo[];
  outputs?: HandleInfo[];
}

function BaseNode({ id, data, children, color, inputs = [], outputs = [] }: BaseNodeProps) {
  const runningNodes = useWorkflowStore((state) => state.runningNodes);
  const getConnectedInputs = useWorkflowStore((state) => state.getConnectedInputs);
  const isRunning = runningNodes.has(id);

  // Get connected inputs for this node
  const connectedInputs = useMemo(() => {
    return getConnectedInputs(id);
  }, [id, getConnectedInputs]);

  return (
    <div
      className={cn(
        'bg-weavy-gray border-2 rounded-lg shadow-xl min-w-[280px] max-w-[280px] transition-all duration-200',
        isRunning ? 'border-weavy-purple animate-pulse-glow' : 'border-gray-600 hover:border-gray-500'
      )}
      style={{
        borderColor: isRunning ? '#8B5CF6' : undefined,
      }}
    >
      {/* Header */}
      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-lg border-b border-gray-700 flex items-center justify-between"
        style={{ backgroundColor: color + '15' }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <p className="text-white text-[13px] font-semibold truncate">{data.label}</p>
        </div>

        {isRunning ? (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-weavy-purple rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-weavy-purple rounded-full animate-pulse delay-100" />
            <div className="w-1.5 h-1.5 bg-weavy-purple rounded-full animate-pulse delay-200" />
          </div>
        ) : inputs.length > 0 ? (
          <NodeValidationBadge nodeId={id} nodeType={data.type as NodeType} />
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3">
        {children}
      </div>

{/* Input Handles */}
      {inputs.map((input, index) => {
        const isConnected = !!connectedInputs[input.id];
        const handleColor = getHandleColor(input.type);
        
        return (
          <div key={input.id} className="group/handle">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{
                top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
                background: isConnected ? handleColor : '#374151',
                width: 10,
                height: 10,
                border: `2px solid ${isConnected ? '#fff' : '#6B7280'}`,
                boxShadow: isConnected ? `0 0 8px ${handleColor}` : 'none',
              }}
              className="hover:scale-125 transition-all duration-200"
            />
            {/* Handle Tooltip */}
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: -12,
                top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
                transform: 'translateX(-100%) translateY(-50%)',
              }}
            >
              <div className="opacity-0 group-hover/handle:opacity-100 transition-opacity duration-200 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-medium whitespace-nowrap border border-gray-700 shadow-lg">
                {input.label}
                {input.required && <span className="text-red-400 ml-1">*</span>}
                <div className="text-gray-400 text-[9px] mt-0.5">{input.type}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Output Handles */}
      {outputs.map((output, index) => {
        const handleColor = getHandleColor(output.type);

        return (
          <div key={output.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{
                top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
                background: handleColor,
                width: 10,
                height: 10,
                border: '2px solid white',
                boxShadow: `0 0 8px ${handleColor}`,
              }}
              className="hover:scale-125 transition-transform"
            />
            {/* Handle Label */}
            <div
              className="absolute pointer-events-none"
              style={{
                right: -8,
                top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
                transform: 'translateX(100%) translateY(-50%)',
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-gray-800 text-white text-[10px] font-medium whitespace-nowrap">
                {output.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(BaseNode);