export type NodeStatus = 'pending' | 'running' | 'success' | 'failed';

export interface NodeExecutionState {
  nodeId: string;
  status: NodeStatus;
  startTime?: number;
  endTime?: number;
  duration?: number;
  error?: string;
  result?: any;
}

export class ExecutionStateManager {
  private states: Map<string, NodeExecutionState> = new Map();
  private listeners: Set<(states: Map<string, NodeExecutionState>) => void> = new Set();

  setNodeState(nodeId: string, status: NodeStatus, data?: Partial<NodeExecutionState>) {
    const existing = this.states.get(nodeId);
    const newState: NodeExecutionState = {
      nodeId,
      status,
      ...existing,
      ...data,
    };

    // Calculate duration if ending
    if (status === 'success' || status === 'failed') {
      if (newState.startTime) {
        newState.endTime = Date.now();
        newState.duration = newState.endTime - newState.startTime;
      }
    }

    this.states.set(nodeId, newState);
    this.notifyListeners();
  }

  getNodeState(nodeId: string): NodeExecutionState | undefined {
    return this.states.get(nodeId);
  }

  getAllStates(): Map<string, NodeExecutionState> {
    return new Map(this.states);
  }

  subscribe(listener: (states: Map<string, NodeExecutionState>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getAllStates()));
  }

  reset() {
    this.states.clear();
    this.notifyListeners();
  }

  getStats() {
    let pending = 0;
    let running = 0;
    let success = 0;
    let failed = 0;
    let totalDuration = 0;

    this.states.forEach(state => {
      switch (state.status) {
        case 'pending': pending++; break;
        case 'running': running++; break;
        case 'success': success++; break;
        case 'failed': failed++; break;
      }
      if (state.duration) totalDuration += state.duration;
    });

    return {
      pending,
      running,
      success,
      failed,
      total: this.states.size,
      totalDuration,
      averageDuration: this.states.size > 0 ? totalDuration / this.states.size : 0,
    };
  }
}