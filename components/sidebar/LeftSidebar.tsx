'use client';

import { useState } from 'react';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import NodeButton from './NodeButton';
import { NODE_CONFIGS } from '@/types/nodes';
import { useWorkflowStore } from '@/store/workflowStore';

export default function LeftSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLeftSidebarCollapsed, toggleLeftSidebar } = useWorkflowStore();

  // Filter nodes based on search
  const filteredNodes = Object.values(NODE_CONFIGS).filter((config) =>
    config.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`relative flex flex-col h-full bg-gradient-to-b from-weavy-gray to-weavy-dark transition-all duration-300 ${
        isLeftSidebarCollapsed ? 'w-16' : 'w-[280px]'
      }`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleLeftSidebar}
        className="absolute -right-3 top-4 z-10 w-6 h-6 bg-weavy-purple hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        title={isLeftSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isLeftSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      {isLeftSidebarCollapsed ? (
        /* COLLAPSED VIEW - Icons Only */
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="w-10 h-10 bg-weavy-purple/20 rounded-lg flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-weavy-purple" />
          </div>
          
          {Object.values(NODE_CONFIGS).map((config) => {
            const IconComponent = require('lucide-react')[config.icon];
            return (
              <button
                key={config.type}
                onClick={() => {
                  // Add node at random position
                  const randomX = 250 + Math.random() * 300;
                  const randomY = 100 + Math.random() * 300;
                  const { addNode } = useWorkflowStore.getState();
                  addNode({
                    id: `${config.type}-${Date.now()}`,
                    type: config.type,
                    position: { x: randomX, y: randomY },
                    data: { label: config.label, type: config.type },
                  } as any);
                }}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-weavy-dark transition-colors group relative"
                style={{ backgroundColor: config.color + '15' }}
                title={config.label}
              >
                <IconComponent
                  className="w-5 h-5"
                  style={{ color: config.color }}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* EXPANDED VIEW - Full Sidebar */
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-weavy-purple" />
              <h2 className="text-white font-bold text-lg">Node Library</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-weavy-dark text-white text-sm rounded-lg border border-gray-600 focus:border-weavy-purple focus:ring-2 focus:ring-weavy-purple/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick Access Label */}
          <div className="px-4 py-3 bg-weavy-dark/50 border-b border-gray-700/30">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Quick Access
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Click or drag to canvas
            </p>
          </div>

          {/* Node Buttons */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm text-center">
                  No nodes found
                </p>
                <p className="text-gray-500 text-xs text-center mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredNodes.map((config) => (
                <NodeButton key={config.type} config={config} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700/50 bg-weavy-dark/50">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">
                {filteredNodes.length} node{filteredNodes.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-1">
                {Object.values(NODE_CONFIGS).slice(0, 6).map((config) => (
                  <div
                    key={config.type}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                    title={config.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}