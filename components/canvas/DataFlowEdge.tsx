'use client';

import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { getHandleColor } from '@/lib/nodeHandles';

function DataFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dataType = data?.type || 'text';
  const handleColor = getHandleColor(dataType);

  return (
    <>
      {/* Main edge path */}
      <path
        id={id}
        style={{
          ...style,
          stroke: selected ? handleColor : '#8B5CF6',
          strokeWidth: selected ? 3 : 2,
        }}
        className="react-flow__edge-path transition-all duration-200"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Edge label with data type */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div
              className="px-2 py-1 rounded-full text-[10px] font-medium text-white shadow-lg border"
              style={{
                backgroundColor: handleColor,
                borderColor: 'white',
              }}
            >
              {dataType}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(DataFlowEdge);