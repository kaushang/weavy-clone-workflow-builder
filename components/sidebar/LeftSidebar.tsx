'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import NodeButton from './NodeButton';
import { NODE_CONFIGS } from '@/types/nodes';

export default function LeftSidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter nodes based on search
  const filteredNodes = Object.values(NODE_CONFIGS).filter((config) =>
    config.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg mb-3">Node Types</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-weavy-dark text-white text-sm rounded-lg border border-gray-600 focus:border-weavy-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Access Label */}
      <div className="px-4 py-2 bg-weavy-dark border-b border-gray-700">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
          Quick Access
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Click or drag to canvas
        </p>
      </div>

      {/* Node Buttons */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNodes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No nodes found
          </p>
        ) : (
          filteredNodes.map((config) => (
            <NodeButton key={config.type} config={config} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-weavy-dark">
        <p className="text-gray-500 text-xs text-center">
          {filteredNodes.length} node{filteredNodes.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}