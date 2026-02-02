'use client';

import { useState, useEffect } from 'react';
import { Clock, Activity, CheckCircle, XCircle, Loader2, ChevronRight } from 'lucide-react';
import { getWorkflowRuns } from '@/lib/services/history-service';
import { useWorkflowStore } from '@/store/workflowStore';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPanel() {
  const [runs, setRuns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { workflowId, isRightSidebarCollapsed, toggleRightSidebar } = useWorkflowStore();

  useEffect(() => {
    fetchRuns();
  }, [workflowId]);

  const fetchRuns = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkflowRuns(workflowId || undefined);
      setRuns(data);
    } catch (error) {
      console.error('Failed to fetch runs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const successRuns = runs.filter(r => r.status === 'success').length;
  const failedRuns = runs.filter(r => r.status === 'failed').length;

  return (
    <>
      {/* Collapsed Button (when sidebar is hidden) */}
      {isRightSidebarCollapsed && (
        <button
          onClick={toggleRightSidebar}
          className="fixed right-4 top-20 z-10 w-10 h-10 bg-weavy-purple hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all"
          title="Show execution history"
        >
          <Activity className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`relative flex flex-col h-full bg-gradient-to-b from-weavy-gray to-weavy-dark transition-all duration-300 ${
          isRightSidebarCollapsed 
            ? 'translate-x-full w-0 opacity-0' 
            : 'translate-x-0 w-[320px] opacity-100'
        }`}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleRightSidebar}
          className="absolute -left-3 top-4 z-10 w-6 h-6 bg-weavy-purple hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
          title="Hide history panel"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>

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
              <p className="text-2xl font-bold text-white">{runs.length}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{successRuns}</p>
              <p className="text-xs text-gray-400">Success</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{failedRuns}</p>
              <p className="text-xs text-gray-400">Failed</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-weavy-purple animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Loading history...</p>
            </div>
          ) : runs.length === 0 ? (
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
          ) : (
            <div className="p-3 space-y-2">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="bg-weavy-dark rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {run.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-semibold ${
                        run.status === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {run.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-500 text-[10px]">
                      {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      Duration: {(run.duration / 1000).toFixed(2)}s
                    </span>
                    <span className="text-gray-500 text-xs capitalize">
                      {run.scope}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-700/50 bg-weavy-dark/50">
          <p className="text-gray-500 text-xs text-center">
            History persists across sessions
          </p>
        </div>
      </div>
    </>
  );
}