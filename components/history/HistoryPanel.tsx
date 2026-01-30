'use client';

import { Clock } from 'lucide-react';

export default function HistoryPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Workflow History
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          All workflow runs with timestamps
        </p>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <Clock className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm text-center">
            No workflow runs yet
          </p>
          <p className="text-gray-500 text-xs text-center mt-1">
            Run your workflow to see execution history
          </p>
        </div>
      </div>
    </div>
  );
}