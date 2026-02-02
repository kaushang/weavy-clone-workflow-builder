import { Node, Edge } from 'reactflow';

export interface ExecutionNode {
    id: string;
    type: string;
    data: any;
    dependencies: string[];
    level: number;
}

export interface ExecutionPlan {
    levels: ExecutionNode[][];
    totalNodes: number;
}

export class WorkflowEngine {
    private nodes: Node[];
    private edges: Edge[];

    constructor(nodes: Node[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Build execution plan with dependency levels
     * Nodes at the same level can execute in parallel
     */
    buildExecutionPlan(): ExecutionPlan {
        const executionNodes = new Map<string, ExecutionNode>();

        // Initialize all nodes
        this.nodes.forEach(node => {
            const dependencies = this.getNodeDependencies(node.id);
            executionNodes.set(node.id, {
                id: node.id,
                type: node.type!,
                data: node.data,
                dependencies,
                level: 0,
            });
        });

        // Calculate levels based on dependencies
        let changed = true;
        while (changed) {
            changed = false;

            executionNodes.forEach(node => {
                if (node.dependencies.length === 0) {
                    if (node.level !== 0) {
                        node.level = 0;
                        changed = true;
                    }
                } else {
                    const maxDepLevel = Math.max(
                        ...node.dependencies.map(depId => {
                            const dep = executionNodes.get(depId);
                            return dep ? dep.level : -1;
                        })
                    );

                    const newLevel = maxDepLevel + 1;
                    if (node.level !== newLevel) {
                        node.level = newLevel;
                        changed = true;
                    }
                }
            });
        }

        // Group nodes by level
        const levels: ExecutionNode[][] = [];
        executionNodes.forEach(node => {
            if (!levels[node.level]) {
                levels[node.level] = [];
            }
            levels[node.level].push(node);
        });

        return {
            levels: levels.filter(level => level.length > 0),
            totalNodes: this.nodes.length,
        };
    }

    /**
     * Get all dependencies (upstream nodes) for a given node
     */
    private getNodeDependencies(nodeId: string): string[] {
        return this.edges
            .filter(edge => edge.target === nodeId)
            .map(edge => edge.source);
    }

    /**
     * Get connected inputs for a node
     */
    getConnectedInputs(nodeId: string, nodes: Node[]): Record<string, any> {
        const connectedInputs: Record<string, any> = {};

        this.edges.forEach(edge => {
            if (edge.target === nodeId && edge.targetHandle) {
                const sourceNode = nodes.find(n => n.id === edge.source);
                if (sourceNode) {
                    let outputValue = '';

                    // Get output based on node type
                    switch (sourceNode.type) {
                        case 'textNode':
                            outputValue = sourceNode.data.text || '';
                            break;
                        case 'uploadImage':
                            outputValue = sourceNode.data.imageUrl || '';
                            break;
                        case 'uploadVideo':
                            outputValue = sourceNode.data.videoUrl || '';
                            break;
                        case 'llmNode':
                            outputValue = sourceNode.data.result || '';
                            break;
                        case 'cropImage':
                            outputValue = sourceNode.data.croppedUrl || '';
                            break;
                        case 'extractFrame':
                            outputValue = sourceNode.data.frameUrl || '';
                            break;
                        default:
                            outputValue = sourceNode.data.result || '';
                    }

                    connectedInputs[edge.targetHandle] = outputValue;
                }
            }
        });

        return connectedInputs;
    }

    /**
     * Validate if workflow is executable
     */
    validateWorkflow(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check for cycles
        if (this.hasCycle()) {
            errors.push('Workflow contains circular dependencies');
        }

        // Check for disconnected required inputs
        this.nodes.forEach(node => {
            if (node.type === 'llmNode') {
                const inputs = this.getConnectedInputs(node.id, this.nodes);
                if (!inputs.userMessage && !node.data.userMessage) {
                    errors.push(`LLM node "${node.data.label}" requires a user message`);
                }
            }

            if (node.type === 'cropImage') {
                const inputs = this.getConnectedInputs(node.id, this.nodes);
                if (!inputs.image) {
                    errors.push(`Crop Image node "${node.data.label}" requires an image input`);
                }
            }

            if (node.type === 'extractFrame') {
                const inputs = this.getConnectedInputs(node.id, this.nodes);
                if (!inputs.video) {
                    errors.push(`Extract Frame node "${node.data.label}" requires a video input`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Check for cycles in the graph
     */
    private hasCycle(): boolean {
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const dfs = (nodeId: string): boolean => {
            visited.add(nodeId);
            recursionStack.add(nodeId);

            const neighbors = this.edges
                .filter(edge => edge.source === nodeId)
                .map(edge => edge.target);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recursionStack.has(neighbor)) {
                    return true;
                }
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const node of this.nodes) {
            if (!visited.has(node.id)) {
                if (dfs(node.id)) return true;
            }
        }

        return false;
    }
}