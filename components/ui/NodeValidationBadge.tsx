'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { NODE_HANDLE_CONFIGS } from '@/lib/nodeHandles';
import { NodeType } from '@/types';

interface NodeValidationBadgeProps {
  nodeId: string;
  nodeType: NodeType;
}

export default function NodeValidationBadge({ nodeId, nodeType }: NodeValidationBadgeProps) {
  const getConnectedInputs = useWorkflowStore((state) => state.getConnectedInputs);
  
  const isValid = useMemo(() => {
    const config = NODE_HANDLE_CONFIGS[nodeType];
    const connectedInputs = getConnectedInputs(nodeId);
    
    // Check if all required inputs are connected
    const requiredInputs = config.inputs.filter(input => input.required);
    return requiredInputs.every(input => connectedInputs[input.id]);
  }, [nodeId, nodeType, getConnectedInputs]);

  if (isValid) {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-900/30 border border-green-700 rounded text-[10px] text-green-400">
        <CheckCircle className="w-3 h-3" />
        <span>Ready</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-900/30 border border-amber-700 rounded text-[10px] text-amber-400">
      <AlertCircle className="w-3 h-3" />
      <span>Connect inputs</span>
    </div>
  );
}