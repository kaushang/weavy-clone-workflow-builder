'use client';

import { memo } from 'react';
import { X, Settings } from 'lucide-react';

interface NodeConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function NodeConfigPanel({ isOpen, onClose, title, children }: NodeConfigPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-weavy-gray border border-gray-700 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-weavy-purple" />
            <h3 className="text-white text-base font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-weavy-purple hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(NodeConfigPanel);