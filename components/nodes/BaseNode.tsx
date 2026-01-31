'use client';

import { memo, ReactNode, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '@/lib/utils';
import { getHandleColor } from '@/lib/nodeHandles';
import NodeValidationBadge from '../ui/NodeValidationBadge';
import { NodeType } from '@/types';
import EnhancedHandle from '../canvas/EnhancedHandle';
import { Settings } from 'lucide-react';

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
  onOpenConfig?: () => void;
}

function BaseNode({ id, data, children, color, inputs = [], outputs = [], onOpenConfig }: BaseNodeProps) {
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

        <div className="flex items-center gap-2">
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="p-1 hover:bg-weavy-dark/50 rounded transition-colors nodrag"
              title="Configure"
            >
              <Settings className="w-3.5 h-3.5 text-gray-400 hover:text-weavy-purple transition-colors" />
            </button>
          )}

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
      </div>

      {/* Content */}
      <div className="p-3">
        {children}
      </div>

      {/* Input Handles */}
      {inputs.map((input, index) => {
        const isConnected = !!connectedInputs[input.id];
        const topPercentage = ((index + 1) * 100) / (inputs.length + 1);

        return (
          <EnhancedHandle
            key={input.id}
            handleId={input.id}
            handleType={input.type}
            label={input.label}
            required={input.required}
            isConnected={isConnected}
            isSource={false}
            style={{
              top: `${topPercentage}%`,
            }}
          />
        );
      })}

      {/* Output Handles */}
      {outputs.map((output, index) => {
        const topPercentage = ((index + 1) * 100) / (outputs.length + 1);

        return (
          <EnhancedHandle
            key={output.id}
            handleId={output.id}
            handleType={output.type}
            label={output.label}
            isConnected={true} // Outputs are always "ready"
            isSource={true}
            style={{
              top: `${topPercentage}%`,
            }}
          />
        );
      })}
    </div>
  );
}

export default memo(BaseNode);