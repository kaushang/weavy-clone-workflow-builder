import { create } from 'zustand';
import { Node, Edge, Connection } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  isRunning: boolean;
  runningNodes: Set<string>;
  connectionErrors: string[];
  
  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setIsRunning: (isRunning: boolean) => void;
  addRunningNode: (nodeId: string) => void;
  removeRunningNode: (nodeId: string) => void;
  clearRunningNodes: () => void;
  resetWorkflow: () => void;
  addConnectionError: (error: string) => void;
  clearConnectionErrors: () => void;
  // New: Get connected nodes
  getConnectedInputs: (nodeId: string) => Record<string, string>;
  getConnectedOutputs: (nodeId: string) => string[];
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodes: [],
  isRunning: false,
  runningNodes: new Set<string>(),
  connectionErrors: [],

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, { ...node, id: node.id || uuidv4() }]
  })),
  
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    )
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== id),
    edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id)
  })),
  
  onConnect: (connection) => set((state) => {
    // Check if connection already exists
    const existingEdge = state.edges.find(
      (edge) =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.targetHandle === connection.targetHandle
    );

    if (existingEdge) {
      return state; // Don't add duplicate
    }

    const newEdge: Edge = {
      id: uuidv4(),
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'default',
      animated: true,
      style: { stroke: '#8B5CF6', strokeWidth: 2 },
    };
    
    return { edges: [...state.edges, newEdge] };
  }),
  
  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  
  addRunningNode: (nodeId) => set((state) => {
    const newRunningNodes = new Set(state.runningNodes);
    newRunningNodes.add(nodeId);
    return { runningNodes: newRunningNodes };
  }),
  
  removeRunningNode: (nodeId) => set((state) => {
    const newRunningNodes = new Set(state.runningNodes);
    newRunningNodes.delete(nodeId);
    return { runningNodes: newRunningNodes };
  }),
  
  clearRunningNodes: () => set({ runningNodes: new Set<string>() }),
  
  resetWorkflow: () => set({
    nodes: [],
    edges: [],
    selectedNodes: [],
    isRunning: false,
    runningNodes: new Set<string>(),
    connectionErrors: [],
  }),

  addConnectionError: (error) => set((state) => ({
    connectionErrors: [...state.connectionErrors, error]
  })),

  clearConnectionErrors: () => set({ connectionErrors: [] }),

  // Get all inputs connected to a node
  getConnectedInputs: (nodeId) => {
    const state = get();
    const connectedInputs: Record<string, string> = {};
    
    state.edges.forEach((edge) => {
      if (edge.target === nodeId) {
        const sourceNode = state.nodes.find((n) => n.id === edge.source);
        if (sourceNode && edge.targetHandle) {
          connectedInputs[edge.targetHandle] = edge.source;
        }
      }
    });
    
    return connectedInputs;
  },

  // Get all nodes connected to outputs of a node
  getConnectedOutputs: (nodeId) => {
    const state = get();
    return state.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  },
}));