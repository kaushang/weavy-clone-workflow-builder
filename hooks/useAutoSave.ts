import { useEffect, useRef } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { updateWorkflow } from '@/lib/api/workflows';

export function useAutoSave(enabled: boolean = true, intervalMs: number = 30000) {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    nodes,
    edges,
    workflowId,
    isSaved,
    markAsSaved,
  } = useWorkflowStore();

  useEffect(() => {
    if (!enabled || !workflowId || isSaved) {
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(async () => {
      try {
        console.log('Auto-saving workflow...');
        await updateWorkflow(workflowId, nodes, edges);
        markAsSaved();
        console.log('Auto-save successful');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [nodes, edges, workflowId, isSaved, enabled, intervalMs, markAsSaved]);
}