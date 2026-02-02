'use client';

import { memo, useState } from 'react';
import { Handle, Position, HandleProps } from 'reactflow';
import { getHandleColor } from '@/lib/nodeHandles';
import { CSSProperties } from 'react';

interface EnhancedHandleProps {
  handleId: string;
  handleType: string;
  label: string;
  required?: boolean;
  isConnected?: boolean;
  isSource?: boolean;
  style?: CSSProperties;
}

function EnhancedHandle({
  handleId,
  handleType,
  label,
  required,
  isConnected,
  isSource = false,
  style,
}: EnhancedHandleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const handleColor = getHandleColor(handleType);
  const position = isSource ? Position.Right : Position.Left;

  return (
    <>
      <Handle
        type={isSource ? 'source' : 'target'}
        position={position}
        id={handleId}
        style={{
          ...style,
          position: 'absolute',
          background: isConnected || isHovering ? handleColor : '#374151',
          width: isHovering ? 12 : 10,
          height: isHovering ? 12 : 10,
          border: `2px solid ${isConnected ? '#fff' : isHovering ? handleColor : '#6B7280'}`,
          boxShadow: isConnected
            ? `0 0 12px ${handleColor}`
            : isHovering
              ? `0 0 8px ${handleColor}80`
              : 'none',
          transition: 'all 0.2s ease',
          zIndex: isHovering ? 10 : 1,
        }}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      <div
        className="group/handle relative"
      >

        {/* Tooltip */}
        <div
          className={`absolute pointer-events-none z-50 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            [isSource ? 'left' : 'right']: isSource ? '12px' : '12px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <div
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap border shadow-xl"
            style={{
              borderColor: handleColor,
              boxShadow: `0 4px 12px ${handleColor}40`,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: handleColor }}
              />
              <span>{label}</span>
              {required && <span className="text-red-400">*</span>}
            </div>
            <div className="text-gray-400 text-[10px] mt-0.5 capitalize">
              {handleType}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(EnhancedHandle);