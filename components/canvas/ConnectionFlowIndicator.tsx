'use client';

import { memo } from 'react';
import { ArrowRight } from 'lucide-react';

interface ConnectionFlowIndicatorProps {
  sourceNodeName: string;
  targetNodeName: string;
  handleType: string;
  isValid: boolean;
}

function ConnectionFlowIndicator({
  sourceNodeName,
  targetNodeName,
  handleType,
  isValid,
}: ConnectionFlowIndicatorProps) {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-xl transition-all ${
          isValid
            ? 'bg-green-900/90 border-green-700'
            : 'bg-red-900/90 border-red-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-sm font-medium">{sourceNodeName}</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-white" />
        
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{targetNodeName}</span>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
        
        <div className="ml-2 px-2 py-1 bg-black/30 rounded text-xs text-white capitalize">
          {handleType}
        </div>
        
        {!isValid && (
          <span className="ml-2 text-red-300 text-xs">Incompatible</span>
        )}
      </div>
    </div>
  );
}

export default memo(ConnectionFlowIndicator);