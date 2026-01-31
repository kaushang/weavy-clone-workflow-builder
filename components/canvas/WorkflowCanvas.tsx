'use client';
// import { useCallback, useRef, useEffect } from 'react';
import { useCallback, useRef, useEffect, useState } from 'react';
import { useMemo } from 'react';
import TextNode from '../nodes/TextNode';
import UploadImageNode from '../nodes/UploadImageNode';
import UploadVideoNode from '../nodes/UploadVideoNode';
import LLMNode from '../nodes/LLMNode';
import CropImageNode from '../nodes/CropImageNode';
import ExtractFrameNode from '../nodes/ExtractFrameNode';
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
import { generateNodeId } from '@/lib/utils';
import { NODE_CONFIGS } from '@/types/nodes';
import { NodeType } from '@/types';

function FlowCanvas() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onConnect,
        setSelectedNodes,
        deleteNode,
        addNode
    } = useWorkflowStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Delete or Backspace was pressed
            if (event.key === 'Delete' || event.key === 'Backspace') {
                // Don't delete if user is typing in an input/textarea
                const target = event.target as HTMLElement;
                if (
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable
                ) {
                    return;
                }

                // Get selected nodes and delete them
                const selectedNodes = nodes.filter((node) => node.selected);
                if (selectedNodes.length > 0) {
                    event.preventDefault();
                    selectedNodes.forEach((node) => {
                        deleteNode(node.id);
                    });
                }

                // Get selected edges and delete them
                const selectedEdges = edges.filter((edge) => edge.selected);
                if (selectedEdges.length > 0) {
                    event.preventDefault();
                    const updatedEdges = edges.filter((edge) => !edge.selected);
                    setEdges(updatedEdges);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [nodes, edges, setEdges]);

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
    // Handle drag over canvas
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsDraggingOver(true);
    }, []);

    const onDragLeave = useCallback(() => {
        setIsDraggingOver(false);
    }, []);

    // Handle drop on canvas
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            // Get the bounds of the canvas
            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            if (!reactFlowBounds) return;

            // Calculate position relative to the canvas
            const position = {
                x: event.clientX - reactFlowBounds.left - 140, // Offset for node width
                y: event.clientY - reactFlowBounds.top - 50,   // Offset for node height
            };

            // Create new node data based on type
            const newNode = {
                id: generateNodeId(type),
                type: type,
                position,
                data: {
                    label: NODE_CONFIGS[type as NodeType]?.label || 'Node',
                    type: type,
                    // Set default values based on node type
                    ...(type === 'textNode' && { text: '' }),
                    ...(type === 'cropImage' && {
                        xPercent: 0,
                        yPercent: 0,
                        widthPercent: 100,
                        heightPercent: 100
                    }),
                    ...(type === 'extractFrame' && { timestamp: '50%' }),
                    ...(type === 'llmNode' && { selectedModel: 'gemini-1.5-flash' }),
                },
            };

            addNode(newNode);
        },
        [addNode]
    )

    return (
        <div ref={reactFlowWrapper} className={`w-full h-full transition-all ${isDraggingOver ? 'ring-2 ring-weavy-purple ring-inset' : ''
            }`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
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
                        <p className="font-medium mb-2">Canvas Controls:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                            <li><strong>Click</strong> node button or <strong>drag</strong> to canvas</li>
                            <li><strong>Drag</strong> nodes to reposition</li>
                            <li><strong>Connect</strong> output to input handles</li>
                            <li><strong>Scroll</strong> to zoom in/out</li>
                            <li><strong>Delete/Backspace</strong> to remove selected items</li>
                            <li><strong>Click background</strong> to deselect</li>
                        </ul>
                    </div>
                </Panel>
            </ReactFlow>
        </div >
    );
}

export default function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <FlowCanvas />
        </ReactFlowProvider>
    );
}