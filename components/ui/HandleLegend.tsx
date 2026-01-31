'use client';

import { Circle } from 'lucide-react';

export default function HandleLegend() {
  const handleTypes = [
    { type: 'text', color: '#3B82F6', label: 'Text' },
    { type: 'image', color: '#10B981', label: 'Image' },
    { type: 'video', color: '#8B5CF6', label: 'Video' },
    { type: 'url', color: '#F59E0B', label: 'URL' },
  ];

  return (
    <div className="bg-weavy-gray/90 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl p-3">
      <p className="text-white text-xs font-semibold mb-2">Handle Types:</p>
      <div className="grid grid-cols-2 gap-2">
        {handleTypes.map((handle) => (
          <div key={handle.type} className="flex items-center gap-1.5">
            <Circle
              className="w-2.5 h-2.5"
              fill={handle.color}
              stroke="white"
              strokeWidth={1}
            />
            <span className="text-gray-300 text-[10px] font-medium">
              {handle.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-[9px] mt-2 leading-tight">
        Only matching types can connect
      </p>
    </div>
  );
}