'use client';

import { useState } from 'react';
import { NodeConfig } from '@/types/nodes';
import * as LucideIcons from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { generateNodeId } from '@/lib/utils';

interface NodeButtonProps {
  config: NodeConfig;
}

export default function NodeButton({ config }: NodeButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const addNode = useWorkflowStore((state) => state.addNode);

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[config.icon];

  const handleClick = () => {
    const randomX = 250 + Math.random() * 300;
    const randomY = 100 + Math.random() * 300;

    const newNode = {
      id: generateNodeId(config.type),
      type: config.type,
      position: { x: randomX, y: randomY },
      data: {
        label: config.label,
        type: config.type,
        ...(config.type === 'textNode' && { text: '' }),
        ...(config.type === 'cropImage' && { 
          xPercent: 0, 
          yPercent: 0, 
          widthPercent: 100, 
          heightPercent: 100 
        }),
        ...(config.type === 'extractFrame' && { timestamp: '50%' }),
        ...(config.type === 'llmNode' && { selectedModel: 'gemini-2.0-flash' }),
      },
    };

    addNode(newNode);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <button
      onClick={handleClick}
      draggable
      onDragStart={(e) => onDragStart(e, config.type)}
      onDragEnd={onDragEnd}
      className={`w-full flex items-center gap-3 p-3 rounded-xl bg-weavy-dark/80 hover:bg-weavy-dark border transition-all group cursor-grab active:cursor-grabbing ${
        isDragging 
          ? 'border-weavy-purple shadow-lg shadow-weavy-purple/20 opacity-50 scale-95' 
          : 'border-gray-700 hover:border-weavy-purple/50 hover:shadow-md'
      }`}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ 
          backgroundColor: config.color + '15',
          border: `1px solid ${config.color}40`
        }}
      >
        {IconComponent && (
          <IconComponent
            className="w-5 h-5"
            style={{ color: config.color }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-white text-sm font-semibold group-hover:text-weavy-purple transition-colors truncate">
          {config.label}
        </p>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 group-hover:text-gray-300 transition-colors">
          {config.description}
        </p>
      </div>

      {/* Category badge */}
      <div className="flex-shrink-0">
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 capitalize">
          {config.category}
        </span>
      </div>
    </button>
  );
}