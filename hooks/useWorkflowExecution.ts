import { useState, useCallback } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import axios from 'axios';
import { WorkflowEngine } from '@/lib/execution/workflow-engine';
import { ExecutionStateManager } from '@/lib/execution/execution-state';
import { cropImage } from '@/lib/services/image-service';
import { extractFrame } from '@/lib/services/video-service';
import { saveWorkflowRun } from '@/lib/services/history-service';

export function useWorkflowExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionProgress, setExecutionProgress] = useState<{
    current: number;
    total: number;
    currentNode: string;
  } | null>(null);

  const {
    nodes,
    edges,
    addRunningNode,
    removeRunningNode,
    updateNode,
    setIsRunning,
  } = useWorkflowStore();

  const executeNode = useCallback(async (nodeId: string, stateManager: ExecutionStateManager) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.error('Node not found:', nodeId);
      return;
    }

    console.log(`▶️ Processing node: ${node.data.label} (${node.type})`);

    // Skip execution for input-only nodes
    if (['textNode', 'uploadImage', 'uploadVideo'].includes(node.type!)) {
      console.log(`⏭️ Skipping execution for input node: ${node.data.label}`);
      stateManager.setNodeState(nodeId, 'success');
      return { status: 'success', message: 'Input node - no execution needed' };
    }

    stateManager.setNodeState(nodeId, 'running', { startTime: Date.now() });
    addRunningNode(nodeId);

    try {
      // Get connected inputs using engine
      const engine = new WorkflowEngine(nodes, edges);
      const connectedInputs = engine.getConnectedInputs(nodeId, nodes);

      console.log('📋 Node type:', node.type);
      console.log('📋 Connected inputs:', Object.keys(connectedInputs));

      // Execute the node
      const response = await axios.post('/api/workflows/run', {
        nodeId,
        nodeType: node.type,
        nodeData: node.data,
        connectedInputs,
      });

      console.log('✅ API response received');

      const { result } = response.data;

      // Handle client-side processing
      if (result.cropParams) {
        console.log('✂️ Processing crop on client side...');
        try {
          const cropResult = await cropImage(result.cropParams);
          updateNode(nodeId, {
            croppedUrl: cropResult.croppedUrl,
            result: 'Image cropped successfully',
          });
          stateManager.setNodeState(nodeId, 'success', { result: cropResult });
          console.log(`✅ Node ${node.data.label} completed (cropped)`);
        } catch (error: any) {
          updateNode(nodeId, { error: error.message });
          stateManager.setNodeState(nodeId, 'failed', { error: error.message });
          console.error(`❌ Crop failed:`, error);
          throw error;
        }
      } else if (result.extractParams) {
        console.log('🎬 Processing frame extraction on client side...');
        try {
          const frameResult = await extractFrame(result.extractParams);
          updateNode(nodeId, {
            frameUrl: frameResult.frameUrl,
            result: 'Frame extracted successfully',
          });
          stateManager.setNodeState(nodeId, 'success', { result: frameResult });
          console.log(`✅ Node ${node.data.label} completed (frame extracted)`);
        } catch (error: any) {
          updateNode(nodeId, { error: error.message });
          stateManager.setNodeState(nodeId, 'failed', { error: error.message });
          console.error(`❌ Frame extraction failed:`, error);
          throw error;
        }
      } else if (result.status === 'success') {
        updateNode(nodeId, { result: result.response });
        stateManager.setNodeState(nodeId, 'success', { result });
        console.log(`✅ Node ${node.data.label} completed`);
      } else {
        updateNode(nodeId, { error: result.error });
        stateManager.setNodeState(nodeId, 'failed', { error: result.error });
        console.error(`❌ Node ${node.data.label} failed:`, result.error);
        throw new Error(result.error);
      }

      return result;
    } catch (error: any) {
      console.error(`❌ Error executing node ${nodeId}:`, error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      updateNode(nodeId, { error: errorMessage });
      stateManager.setNodeState(nodeId, 'failed', { error: errorMessage });

      throw error;
    } finally {
      removeRunningNode(nodeId);
    }
  }, [nodes, edges, addRunningNode, removeRunningNode, updateNode]);

  const executeWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Add nodes to the workflow first');
      return;
    }

    setIsExecuting(true);
    setIsRunning(true);
    setExecutionError(null);
    setExecutionProgress(null);

    const stateManager = new ExecutionStateManager();

    try {
      console.log('🚀 Starting workflow execution with engine...');

      // Create workflow engine
      const engine = new WorkflowEngine(nodes, edges);

      // Validate workflow
      const validation = engine.validateWorkflow();
      if (!validation.valid) {
        const errorMsg = validation.errors.join('\n');
        alert(`Workflow validation failed:\n${errorMsg}`);
        setExecutionError(errorMsg);
        return;
      }

      // Build execution plan
      const plan = engine.buildExecutionPlan();
      console.log(`📊 Execution plan: ${plan.levels.length} levels, ${plan.totalNodes} nodes`);

      plan.levels.forEach((level, index) => {
        console.log(`  Level ${index}: ${level.map(n => n.data.label).join(', ')}`);
      });

      let completed = 0;

      // Execute level by level
      for (let levelIndex = 0; levelIndex < plan.levels.length; levelIndex++) {
        const level = plan.levels[levelIndex];
        console.log(`\n🔄 Executing level ${levelIndex} (${level.length} nodes in parallel)...`);

        // Execute all nodes in this level in parallel
        const promises = level.map(async (execNode) => {
          setExecutionProgress({
            current: completed + 1,
            total: plan.totalNodes,
            currentNode: execNode.data.label,
          });

          // Skip input nodes
          if (['textNode', 'uploadImage', 'uploadVideo'].includes(execNode.type)) {
            return;
          }

          await executeNode(execNode.id, stateManager);
          completed++;
        });

        // Wait for all nodes in this level to complete
        await Promise.all(promises);

        console.log(`✅ Level ${levelIndex} completed`);
      }

      // Get final stats
      const stats = stateManager.getStats();
      console.log('\n📈 Execution Stats:', stats);
      console.log('✅ Workflow execution completed successfully');
        
      // Save workflow run to history
      if (useWorkflowStore.getState().workflowId) {
        try {
          await saveWorkflowRun(
            useWorkflowStore.getState().workflowId!,
            stats.failed > 0 ? 'failed' : 'success',
            stats.totalDuration,
            Array.from(stateManager.getAllStates().values())
          );
          console.log('💾 Workflow run saved to history');
        } catch (error) {
          console.error('Failed to save workflow run:', error);
        }
      }

      if (stats.failed > 0) {
        setExecutionError(`${stats.failed} node(s) failed`);
      }

      if (stats.failed > 0) {
        setExecutionError(`${stats.failed} node(s) failed`);
      }
    } catch (error: any) {
      console.error('❌ Workflow execution failed:', error);
      setExecutionError(error.message);
    } finally {
      setIsExecuting(false);
      setIsRunning(false);
      setExecutionProgress(null);
    }
  }, [nodes, edges, executeNode, setIsRunning]);

  return {
    isExecuting,
    executionError,
    executionProgress,
    executeNode,
    executeWorkflow,
  };
}