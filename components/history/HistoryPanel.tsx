'use client';

import { Clock, Activity } from 'lucide-react';

export default function HistoryPanel() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-weavy-gray to-weavy-dark">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-weavy-purple" />
          <h2 className="text-white font-bold text-lg">Execution History</h2>
        </div>
        <p className="text-gray-400 text-xs">
          Track all workflow runs and results
        </p>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-3 bg-weavy-dark/50 border-b border-gray-700/30">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">0</p>
            <p className="text-xs text-gray-400">Success</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">0</p>
            <p className="text-xs text-gray-400">Failed</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center justify-center h-full px-4">
          <div className="w-20 h-20 rounded-full bg-weavy-dark border-2 border-dashed border-gray-700 flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-400 text-sm text-center font-medium">
            No executions yet
          </p>
          <p className="text-gray-500 text-xs text-center mt-2 max-w-[200px]">
            Click "Run Workflow" to execute your automation and see results here
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-700/50 bg-weavy-dark/50">
        <p className="text-gray-500 text-xs text-center">
          History persists across sessions
        </p>
      </div>
    </div>
  );
}