import { useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import axios from 'axios';
import { cropImage } from '@/lib/services/image-service';
import { extractFrame } from '@/lib/services/video-service';

export function useWorkflowExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  
  const {
    nodes,
    edges,
    addRunningNode,
    removeRunningNode,
    updateNode,
    setIsRunning,
  } = useWorkflowStore();

  const executeNode = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.error('Node not found:', nodeId);
      return;
    }

    console.log(`▶️ Processing node: ${node.data.label} (${node.type})`); // 3

    // Skip execution for input-only nodes
    if (['textNode', 'uploadImage', 'uploadVideo'].includes(node.type!)) {
      console.log(`⏭️ Skipping execution for input node: ${node.data.label}`);
      return { status: 'success', message: 'Input node - no execution needed' };
    }
    
    addRunningNode(nodeId);

    try {
      // Get connected inputs
      const connectedInputs: Record<string, any> = {};
      edges.forEach(edge => {
        if (edge.target === nodeId && edge.targetHandle) {
          const sourceNode = nodes.find(n => n.id === edge.source);
          if (sourceNode) {
            console.log(`📎 Connected input ${edge.targetHandle} from ${sourceNode.data.label}`); // 4
            
            // Get the output data from source node
            let outputValue = '';
            
            if (sourceNode.type === 'textNode') {
              outputValue = sourceNode.data.text || '';
            } else if (sourceNode.type === 'uploadImage') {
              outputValue = sourceNode.data.imageUrl || '';
            } else if (sourceNode.type === 'uploadVideo') {
              outputValue = sourceNode.data.videoUrl || '';
            } else {
              outputValue = sourceNode.data.result || '';
            }
            
            console.log(`   Value: "${outputValue.substring(0, 50)}${outputValue.length > 50 ? '...' : ''}"`);  // 5
            console.log(`   Target handle: ${edge.targetHandle}`); // 6
            
            connectedInputs[edge.targetHandle] = outputValue;
          }
        }
      });

      console.log('📋 Node type:', node.type); // 7
      console.log('📋 Connected inputs:', Object.keys(connectedInputs)); // 8

      // Execute the node
      const response = await axios.post('/api/workflows/run', {
        nodeId,
        nodeType: node.type,
        nodeData: node.data,
        connectedInputs,
      });

      console.log('✅ API response received'); // 9

      const { result } = response.data;

      // Update node with result
      // Handle client-side processing
      if (result.cropParams) {
        console.log('✂️ Processing crop on client side...');
        try {
          const cropResult = await cropImage(result.cropParams);
          updateNode(nodeId, { 
            croppedUrl: cropResult.croppedUrl,
            result: 'Image cropped successfully',
          });
          console.log(`✅ Node ${node.data.label} completed (cropped)`);
        } catch (error: any) {
          updateNode(nodeId, { error: error.message });
          console.error(`❌ Crop failed:`, error);
        }
      } else if (result.extractParams) {
        console.log('🎬 Processing frame extraction on client side...');
        try {
          const frameResult = await extractFrame(result.extractParams);
          updateNode(nodeId, { 
            frameUrl: frameResult.frameUrl,
            result: 'Frame extracted successfully',
          });
          console.log(`✅ Node ${node.data.label} completed (frame extracted)`);
        } catch (error: any) {
          updateNode(nodeId, { error: error.message });
          console.error(`❌ Frame extraction failed:`, error);
        }
      } else if (result.status === 'success') { 
        updateNode(nodeId, { result: result.response });
        console.log(`✅ Node ${node.data.label} completed`);
      } else {
        updateNode(nodeId, { error: result.error });
        console.error(`❌ Node ${node.data.label} failed:`, result.error); // 10
      }

      return result;
    } catch (error: any) {
      console.error(`❌ Error executing node ${nodeId}:`, error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      updateNode(nodeId, { error: errorMessage });
      
      // Show user-friendly alert
      alert(`Error executing ${node.data.label}: ${errorMessage}`);
      
      throw error;
    } finally {
      removeRunningNode(nodeId);
    }
  };

  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      alert('Add nodes to the workflow first');
      return;
    }

    setIsExecuting(true);
    setIsRunning(true);
    setExecutionError(null);

    try {
      console.log('🚀 Starting workflow execution...'); // 1

      // Find execution nodes (LLM, Crop, Extract Frame)
      const executionNodes = nodes.filter(node => 
        ['llmNode', 'cropImage', 'extractFrame'].includes(node.type!)
      );

      if (executionNodes.length === 0) {
        alert('Add at least one processing node (LLM, Crop Image, or Extract Frame)');
        return;
      }

      console.log(`📊 Found ${executionNodes.length} execution node(s)`); // 2

      // Execute all processing nodes
      for (const node of executionNodes) {
        await executeNode(node.id);
      }

      console.log('✅ Workflow execution completed'); // 11
    } catch (error: any) {
      console.error('❌ Workflow execution failed:', error); 
      setExecutionError(error.message);
    } finally {
      setIsExecuting(false);
      setIsRunning(false);
    }
  };

  return {
    isExecuting,
    executionError,
    executeNode,
    executeWorkflow,
  };
}