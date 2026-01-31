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
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import { generateNodeId } from '@/lib/utils';
import { NODE_CONFIGS } from '@/types/nodes';
import { NodeType } from '@/types';
import { canConnect, getHandleType, wouldCreateCycle } from '@/lib/utils'
import Toast from '../ui/Toast';
import HandleLegend from '../ui/HandleLegend';
import ConnectionFlowIndicator from './ConnectionFlowIndicator';
import DataFlowEdge from './DataFlowEdge';
function FlowCanvas() {
    const [connectionAttempt, setConnectionAttempt] = useState<{
        sourceNode: string;
        targetNode: string;
        handleType: string;
        isValid: boolean;
    } | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'error' | 'success' | 'info' }>>([]);
    const reactFlowInstance = useReactFlow();
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

    const isValidConnection = useCallback((connection: any) => {
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        if (!sourceNode || !targetNode) return false;

        const sourceHandleType = getHandleType(sourceNode.type!, connection.sourceHandle || 'output');
        const targetHandleType = getHandleType(targetNode.type!, connection.targetHandle || 'input');

        const isCompatible = canConnect(sourceHandleType, targetHandleType);

        // Show connection indicator
        setConnectionAttempt({
            sourceNode: sourceNode.data.label,
            targetNode: targetNode.data.label,
            handleType: sourceHandleType,
            isValid: isCompatible,
        });

        // Clear after delay
        setTimeout(() => setConnectionAttempt(null), 2000);

        if (connection.source === connection.target) {
            setToasts((prev) => [...prev, {
                id: Date.now().toString(),
                message: 'Cannot connect a node to itself',
                type: 'error',
            }]);
            return false;
        }

        if (wouldCreateCycle(connection.source, connection.target, edges)) {
            setToasts((prev) => [...prev, {
                id: Date.now().toString(),
                message: 'Connection would create a circular dependency',
                type: 'error',
            }]);
            return false;
        }

        if (!isCompatible) {
            setToasts((prev) => [...prev, {
                id: Date.now().toString(),
                message: `Incompatible types: ${sourceHandleType} → ${targetHandleType}`,
                type: 'error',
            }]);
        }

        return isCompatible;
    }, [nodes, edges]);

    // Handle selection changes
    const onSelectionChange = useCallback(
        ({ nodes: selectedNodes }: any) => {
            setSelectedNodes(selectedNodes.map((n: any) => n.id));
        },
        [setSelectedNodes]
    );
    // Register custom edge types
    const edgeTypes = useMemo(
        () => ({
            default: DataFlowEdge,
        }),
        []
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

    // Handle drop on canvas - UPDATED VERSION
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setIsDraggingOver(false);

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            // Use ReactFlow's screenToFlowPosition for accurate positioning
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Adjust for node center (half of node width and approximate height)
            position.x -= 140; // Half of 280px width
            position.y -= 40;  // Approximate center

            // Create new node data based on type
            const newNode = {
                id: generateNodeId(type),
                type: type,
                position,
                data: {
                    label: NODE_CONFIGS[type as NodeType]?.label || 'Node',
                    type: type,
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
        [reactFlowInstance, addNode, setIsDraggingOver]
    );

    const onConnectStart = useCallback(() => {
        setIsConnecting(true);
    }, []);

    const onConnectEnd = useCallback(() => {
        setIsConnecting(false);
    }, []);

    return (
        <div ref={reactFlowWrapper} className={`w-full h-full transition-all ${isDraggingOver ? 'ring-2 ring-weavy-purple ring-inset' : ''
            }`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                onSelectionChange={onSelectionChange}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#8B5CF6', strokeWidth: 2 },
                }}
                connectionLineStyle={{
                    stroke: '#8B5CF6',
                    strokeWidth: 3,
                    strokeDasharray: '5, 5',
                }}
            // connectionLineType="bezier"
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
                <Panel position="top-left" className="bg-weavy-gray/90 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl p-4 m-4">
                    <div className="text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="font-bold text-sm">Canvas Controls</p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                <span>{nodes.length} nodes</span>
                                <span>•</span>
                                <span>{edges.length} connections</span>
                            </div>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-weavy-purple font-mono">•</span>
                                <span><strong className="text-white">Click</strong> node button or <strong className="text-white">drag</strong> to canvas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-weavy-purple font-mono">•</span>
                                <span><strong className="text-white">Drag</strong> nodes to reposition</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-weavy-purple font-mono">•</span>
                                <span><strong className="text-white">Connect</strong> output → input handles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-weavy-purple font-mono">•</span>
                                <span><strong className="text-white">Select</strong> edge to see data type</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-weavy-purple font-mono">•</span>
                                <span><strong className="text-white">Delete/Backspace</strong> to remove</span>
                            </li>
                        </ul>
                    </div>
                </Panel>
                <Panel position="bottom-left" className="m-4">
                    <HandleLegend />
                </Panel>
            </ReactFlow>
            {connectionAttempt && (
                <ConnectionFlowIndicator
                    sourceNodeName={connectionAttempt.sourceNode}
                    targetNodeName={connectionAttempt.targetNode}
                    handleType={connectionAttempt.handleType}
                    isValid={connectionAttempt.isValid}
                />
            )}
            {/* Toast Notifications */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                />
            ))}
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