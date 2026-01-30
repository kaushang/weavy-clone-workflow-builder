'use client';
import { useMemo } from 'react';
import TextNode from '../nodes/TextNode';
import UploadImageNode from '../nodes/UploadImageNode';
import UploadVideoNode from '../nodes/UploadVideoNode';
import LLMNode from '../nodes/LLMNode';
import CropImageNode from '../nodes/CropImageNode';
import ExtractFrameNode from '../nodes/ExtractFrameNode';
import { useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    ReactFlowProvider,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import { canConnect } from '@/lib/utils';

function FlowCanvas() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onConnect,
        setSelectedNodes,
    } = useWorkflowStore();

    // Handle node drag
    const onNodesChange = useCallback(
        (changes: any) => {
            // Apply changes to nodes (position, selection, etc.)
            const updatedNodes = changes.reduce((acc: any[], change: any) => {
                if (change.type === 'position' && change.position) {
                    return acc.map((node) =>
                        node.id === change.id
                            ? { ...node, position: change.position }
                            : node
                    );
                }
                if (change.type === 'select') {
                    return acc.map((node) =>
                        node.id === change.id
                            ? { ...node, selected: change.selected }
                            : node
                    );
                }
                return acc;
            }, nodes);

            setNodes(updatedNodes);
        },
        [nodes, setNodes]
    );

    // Handle edge changes
    const onEdgesChange = useCallback(
        (changes: any) => {
            const updatedEdges = changes.reduce((acc: any[], change: any) => {
                if (change.type === 'remove') {
                    return acc.filter((edge) => edge.id !== change.id);
                }
                if (change.type === 'select') {
                    return acc.map((edge) =>
                        edge.id === change.id
                            ? { ...edge, selected: change.selected }
                            : edge
                    );
                }
                return acc;
            }, edges);

            setEdges(updatedEdges);
        },
        [edges, setEdges]
    );

    // Validate connections before allowing them
    const isValidConnection = useCallback((connection: any) => {
        // Find source and target nodes
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        if (!sourceNode || !targetNode) return false;

        // Get handle types from connection
        const sourceHandleType = connection.sourceHandle || 'text';
        const targetHandleType = connection.targetHandle || 'text';

        // Check if connection is valid
        return canConnect(sourceHandleType, targetHandleType);
    }, [nodes]);

    // Handle selection changes
    const onSelectionChange = useCallback(
        ({ nodes: selectedNodes }: any) => {
            setSelectedNodes(selectedNodes.map((n: any) => n.id));
        },
        [setSelectedNodes]
    );

    // Register custom node types
    const nodeTypes = useMemo(
        () => ({
            textNode: TextNode,
            uploadImage: UploadImageNode,
            uploadVideo: UploadVideoNode,
            llmNode: LLMNode,
            cropImage: CropImageNode,
            extractFrame: ExtractFrameNode,
        }),
        []
    );
    return (
        <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                onSelectionChange={onSelectionChange}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#8B5CF6', strokeWidth: 2 },
                }}
            >
                {/* Dot pattern background */}
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#374151"
                />

                {/* Zoom/pan controls */}
                <Controls
                    showInteractive={false}
                    className="bg-weavy-gray border border-gray-700"
                />

                {/* Mini map */}
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'textNode': return '#3B82F6';
                            case 'uploadImage': return '#10B981';
                            case 'uploadVideo': return '#8B5CF6';
                            case 'llmNode': return '#F59E0B';
                            case 'cropImage': return '#EC4899';
                            case 'extractFrame': return '#6366F1';
                            default: return '#6B7280';
                        }
                    }}
                    className="bg-weavy-gray border border-gray-700"
                    maskColor="rgba(15, 23, 42, 0.8)"
                />

                {/* Info panel */}
                <Panel position="top-left" className="bg-weavy-gray border border-gray-700 rounded-lg p-3 m-4">
                    <div className="text-white text-sm">
                        <p className="font-medium">Canvas Controls:</p>
                        <ul className="text-xs text-gray-400 mt-1 space-y-1">
                            <li>• Drag nodes to reposition</li>
                            <li>• Connect output to input handles</li>
                            <li>• Scroll to zoom in/out</li>
                            <li>• Click background to deselect</li>
                        </ul>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export default function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <FlowCanvas />
        </ReactFlowProvider>
    );
}