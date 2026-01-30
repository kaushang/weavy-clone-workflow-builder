'use client';

import { NodeConfig } from '@/types/nodes';
import * as LucideIcons from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { generateNodeId } from '@/lib/utils';

interface NodeButtonProps {
  config: NodeConfig;
}

export default function NodeButton({ config }: NodeButtonProps) {
  const addNode = useWorkflowStore((state) => state.addNode);

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[config.icon];

  const handleClick = () => {
    const newNode = {
      id: generateNodeId(config.type),
      type: config.type,
      position: { x: 250, y: 100 }, // Default position
      data: {
        label: config.label,
        type: config.type,
      },
    };

    addNode(newNode);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-weavy-dark hover:bg-gray-700 border border-gray-600 hover:border-weavy-purple transition-all group"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.color + '20' }}
      >
        {IconComponent && (
          <IconComponent
            className="w-5 h-5"
            style={{ color: config.color }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="text-white text-sm font-medium group-hover:text-weavy-purple transition-colors">
          {config.label}
        </p>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
          {config.description}
        </p>
      </div>
    </button>
  );
}