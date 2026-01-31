'use client';

import { Circle, ArrowRight, Check, X } from 'lucide-react';

export default function HandleLegend() {
  const handleTypes = [
    { type: 'text', color: '#3B82F6', label: 'Text' },
    { type: 'image', color: '#10B981', label: 'Image' },
    { type: 'video', color: '#8B5CF6', label: 'Video' },
    { type: 'url', color: '#F59E0B', label: 'URL' },
  ];

  const compatibility = {
    text: ['text'],
    image: ['image'],
    video: ['video'],
    url: ['image', 'url'],
  };

  return (
    <div className="bg-weavy-gray/90 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl p-3">
      <p className="text-white text-xs font-semibold mb-2">Handle Types:</p>
      
      {/* Type indicators */}
      <div className="grid grid-cols-2 gap-2 mb-3">
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

      {/* Compatibility matrix */}
      <div className="border-t border-gray-700 pt-2 mt-2">
        <p className="text-gray-400 text-[9px] font-semibold mb-2">
          COMPATIBILITY:
        </p>
        <div className="space-y-1">
          {handleTypes.map((handle) => (
            <div key={`compat-${handle.type}`} className="flex items-center gap-1 text-[9px]">
              <Circle
                className="w-1.5 h-1.5 flex-shrink-0"
                fill={handle.color}
                stroke="none"
              />
              <ArrowRight className="w-2.5 h-2.5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-400 flex-1">
                {compatibility[handle.type as keyof typeof compatibility].join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-[8px] mt-2 leading-tight">
        Hover handles for details
      </p>
    </div>
  );
}