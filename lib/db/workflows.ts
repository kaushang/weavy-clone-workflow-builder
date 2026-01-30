import { prisma } from './prisma';
import { Workflow, WorkflowRun } from '@/types';

// Save a new workflow
export async function saveWorkflow(
    userId: string,
    name: string,
    nodes: any[],
    edges: any[]
): Promise<Workflow> {
    const workflow = await prisma.workflow.create({
        data: {
            userId,
            name,
            nodes,
            edges,
        },
    });

    return workflow as Workflow;
}

// Get all workflows for a user
export async function getUserWorkflows(userId: string): Promise<Workflow[]> {
    const workflows = await prisma.workflow.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });

    return workflows as Workflow[];
}

// Get a specific workflow
export async function getWorkflow(id: string, userId: string): Promise<Workflow | null> {
    const workflow = await prisma.workflow.findFirst({
        where: { id, userId },
    });

    return workflow as Workflow | null;
}

// Update a workflow
export async function updateWorkflow(
    id: string,
    userId: string,
    nodes: any[],
    edges: any[]
): Promise<Workflow | null> {
    const workflow = await prisma.workflow.update({
        where: { id },
        data: {
            nodes,
            edges,
            updatedAt: new Date(),
        },
    });

    return workflow as Workflow;
}

// Delete a workflow
export async function deleteWorkflow(id: string, userId: string): Promise<void> {
    await prisma.workflow.delete({
        where: { id },
    });
}

// Save workflow run history
export async function saveWorkflowRun(
    workflowId: string,
    userId: string,
    status: string,
    scope: string,
    duration: number | null,
    nodeResults: any[]
): Promise<WorkflowRun> {
    const run = await prisma.workflowRun.create({
        data: {
            workflowId,
            userId,
            status,
            scope,
            duration,
            nodeResults,
        },
    });

    return run as unknown as WorkflowRun;
}

// Get workflow run history
export async function getWorkflowRuns(workflowId: string): Promise<WorkflowRun[]> {
    const runs = await prisma.workflowRun.findMany({
        where: { workflowId },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to last 50 runs
    });

    return runs as unknown as WorkflowRun[];
}

// Get all runs for a user
export async function getUserWorkflowRuns(userId: string): Promise<WorkflowRun[]> {
    const runs = await prisma.workflowRun.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to last 100 runs
    });

    return runs as unknown as WorkflowRun[];
}