import axios from 'axios';
import { Workflow } from '@/types';

// Save a new workflow
export async function createWorkflow(
  name: string,
  nodes: any[],
  edges: any[]
): Promise<Workflow> {
  const response = await axios.post('/api/workflows', {
    name,
    nodes,
    edges,
  });
  return response.data.workflow;
}

// Get all workflows for current user
export async function getWorkflows(): Promise<Workflow[]> {
  const response = await axios.get('/api/workflows');
  return response.data.workflows;
}

// Get a specific workflow
export async function getWorkflow(id: string): Promise<Workflow> {
  const response = await axios.get(`/api/workflows/${id}`);
  return response.data.workflow;
}

// Update existing workflow
export async function updateWorkflow(
  id: string,
  nodes: any[],
  edges: any[]
): Promise<Workflow> {
  const response = await axios.put(`/api/workflows/${id}`, {
    nodes,
    edges,
  });
  return response.data.workflow;
}

// Delete workflow
export async function deleteWorkflow(id: string): Promise<void> {
  await axios.delete(`/api/workflows/${id}`);
}

// Export workflow as JSON
export function exportWorkflowJSON(workflow: Workflow): string {
  return JSON.stringify(
    {
      name: workflow.name,
      nodes: workflow.nodes,
      edges: workflow.edges,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

// Import workflow from JSON
export function importWorkflowJSON(jsonString: string): {
  name: string;
  nodes: any[];
  edges: any[];
} {
  const data = JSON.parse(jsonString);
  return {
    name: data.name || 'Imported Workflow',
    nodes: data.nodes || [],
    edges: data.edges || [],
  };
}