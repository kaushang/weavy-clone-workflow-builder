import axios from 'axios';
import { WorkflowRun } from '@/types';

export async function saveWorkflowRun(
  workflowId: string,
  status: 'success' | 'failed',
  duration: number,
  nodeResults: any[]
): Promise<WorkflowRun> {
  const response = await axios.post('/api/workflows/runs', {
    workflowId,
    status,
    duration,
    nodeResults,
  });
  return response.data.run;
}

export async function getWorkflowRuns(workflowId?: string): Promise<WorkflowRun[]> {
  const url = workflowId 
    ? `/api/workflows/runs?workflowId=${workflowId}`
    : '/api/workflows/runs';
  
  const response = await axios.get(url);
  return response.data.runs;
}