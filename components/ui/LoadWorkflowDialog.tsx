'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileText, Trash2 } from 'lucide-react';
import { getWorkflows, deleteWorkflow } from '@/lib/api/workflows';
import { useWorkflowStore } from '@/store/workflowStore';
import { Workflow } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface LoadWorkflowDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoadWorkflowDialog({ isOpen, onClose }: LoadWorkflowDialogProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);

  useEffect(() => {
    if (isOpen) {
      fetchWorkflows();
    }
  }, [isOpen]);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (workflow: Workflow) => {
    loadWorkflow({
      id: workflow.id,
      name: workflow.name,
      nodes: workflow.nodes as any[],
      edges: workflow.edges as any[],
    });
    onClose();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    setDeletingId(id);
    try {
      await deleteWorkflow(id);
      setWorkflows(workflows.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      alert('Failed to delete workflow');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-weavy-gray border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-bold">Load Workflow</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-weavy-purple animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Loading workflows...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No saved workflows</p>
              <p className="text-gray-500 text-xs mt-1">Create and save a workflow to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => handleLoad(workflow)}
                  className="w-full flex items-center justify-between p-4 bg-weavy-dark hover:bg-gray-700 border border-gray-600 hover:border-weavy-purple rounded-lg transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-weavy-purple flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {workflow.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {(workflow.nodes as any[]).length} nodes • Updated{' '}
                        {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(workflow.id, e)}
                    disabled={deletingId === workflow.id}
                    className="p-2 hover:bg-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {deletingId === workflow.id ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}