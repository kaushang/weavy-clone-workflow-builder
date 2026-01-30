'use client';

import { UserButton } from '@clerk/nextjs';
import { Play, Save, Download } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-weavy-gray border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-weavy-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <h1 className="text-white font-semibold text-lg">
            Weavy Workflow Builder
          </h1>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-weavy-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
            <Play className="w-4 h-4" />
            Run Workflow
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Right: User Button */}
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </nav>
  );
}