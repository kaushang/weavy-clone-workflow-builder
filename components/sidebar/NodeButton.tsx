'use client';

import { NodeConfig } from '@/types/nodes';
import * as LucideIcons from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { generateNodeId } from '@/lib/utils';
import { useState } from 'react';

interface NodeButtonProps {
    config: NodeConfig;
}

export default function NodeButton({ config }: NodeButtonProps) {
    const [isDragging, setIsDragging] = useState(false);
    const addNode = useWorkflowStore((state) => state.addNode);

    // Get the icon component dynamically
    const IconComponent = (LucideIcons as any)[config.icon];

    const handleClick = () => {
        // Calculate a random position to avoid overlapping
        const randomX = 250 + Math.random() * 300;
        const randomY = 100 + Math.random() * 300;

        const newNode = {
            id: generateNodeId(config.type),
            type: config.type,
            position: { x: randomX, y: randomY },
            data: {
                label: config.label,
                type: config.type,
                // Set default values based on node type
                ...(config.type === 'textNode' && { text: '' }),
                ...(config.type === 'cropImage' && {
                    xPercent: 0,
                    yPercent: 0,
                    widthPercent: 100,
                    heightPercent: 100
                }),
                ...(config.type === 'extractFrame' && { timestamp: '50%' }),
                ...(config.type === 'llmNode' && { selectedModel: 'gemini-1.5-flash' }),
            },
        };

        addNode(newNode);
    };

    // Handle drag start
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
            className={`w-full flex items-center gap-3 p-3 rounded-lg bg-weavy-dark hover:bg-gray-700 border transition-all group cursor-grab active:cursor-grabbing ${isDragging
                    ? 'border-weavy-purple opacity-50'
                    : 'border-gray-600 hover:border-weavy-purple'
                }`}

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